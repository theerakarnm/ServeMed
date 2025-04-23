import { db } from "@workspace/db";
import { brands, categories, productCategories, productImages, products, productVariants } from "@workspace/db/src/schema";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

interface Category {
  categoryId: number;
  name: string;
  parentCategoryId: number | null;
  description: string | null;
  children?: Category[];
}[]

function buildCategoryTree(allCategories: Category[] = [], parentId: number | null = null): Category[] {
  return allCategories
    .filter((c) => c.parentCategoryId === parentId)
    .map((category) => ({
      ...category,
      children: buildCategoryTree([], category.categoryId),
    }));
}

export async function getCategoryTree() {
  try {
    const allCategories = await db
      .select({
        categoryId: categories.categoryId,
        name: categories.name,
        parentCategoryId: categories.parentCategoryId,
        description: categories.description,
      })
      .from(categories)
      .orderBy(asc(categories.name));

    return buildCategoryTree(allCategories);
  } catch (error) {
    console.error("Error fetching category tree:", error);
    return [];
  }
}

export async function getCategoryWithProducts(
  categoryId: number,
  page = 1,
  pageSize = 20
) {
  try {
    // Get category info
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.categoryId, categoryId))
      .limit(1);

    if (!category.length) {
      return null;
    }

    // Get subcategories
    const subcategories = await db
      .select()
      .from(categories)
      .where(eq(categories.parentCategoryId, categoryId));

    // Get products in this category
    const productList = await db
      .select({
        productId: products.productId,
        name: products.name,
        brandId: products.brandId,
        brandName: brands.name,
        overallRating: products.overallRating,
        totalReviews: products.totalReviews,
        // Get the lowest price from variants
        price: sql<number>`min(${productVariants.price})`,
        currency: productVariants.currency,
        imageUrl: productImages.imageUrl,
      })
      .from(productCategories)
      .innerJoin(products, eq(productCategories.productId, products.productId))
      .leftJoin(brands, eq(products.brandId, brands.brandId))
      .leftJoin(
        productVariants,
        eq(products.productId, productVariants.productId)
      )
      .leftJoin(
        productImages,
        and(
          eq(products.productId, productImages.productId),
          eq(productImages.isThumbnail, true)
        )
      )
      .where(eq(productCategories.categoryId, categoryId))
      .groupBy(
        products.productId,
        brands.name,
        productVariants.currency,
        productImages.imageUrl
      )
      .orderBy(desc(products.totalReviews))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    // Get total products count for pagination
    const [{ countRow }] = await db
      .select({ countRow: count() })
      .from(productCategories)
      .where(eq(productCategories.categoryId, categoryId));

    return {
      category: category[0],
      subcategories,
      products: productList,
      pagination: {
        totalItems: Number(countRow),
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(Number(count) / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching category with products:", error);
    return null;
  }
}

export async function getTopCategories(limit = 5) {
  try {
    const query = sql`
      SELECT
        ${categories.categoryId} AS "categoryId",
        ${categories.name},
        COUNT(${productCategories.productId}) AS "productCount"
      FROM ${categories} c
      LEFT JOIN ${productCategories} pc
        ON ${categories.categoryId} = ${productCategories.categoryId}
      GROUP BY ${categories.categoryId}, ${categories.name}
      ORDER BY COUNT(${productCategories.productId}) DESC
      LIMIT ${limit}
    `;

    const { rows } = await db.execute(query);

    const topCategories = rows.map((row: {
      categoryId: number;
      name: string;
      productCount: number;
    }) => ({
      categoryId: row.categoryId,
      name: row.name,
      productCount: Number(row.productCount),
    }));

    return topCategories;
  } catch (error) {
    console.error("Error fetching top categories:", error);
    return [];
  }
}
