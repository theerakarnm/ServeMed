import { db } from "@workspace/db";
import { answers, brands, categories, productCategories, productImages, products, productVariants, questions, reviewImages, reviews, supplementFacts, user } from "@workspace/db/src/schema";
import { and, asc, count, desc, eq, gte, lte, or, SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

export async function getProducts({
  categoryId,
  brandId,
  minPrice,
  maxPrice,
  minRating,
  sortBy = "popularity",
  page = 1,
  pageSize = 20,
}: {
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popularity";
  page?: number;
  pageSize?: number;
}) {
  try {
    // Start building the query
    const queryBuilder = db
      .select({
        productId: products.productId,
        name: products.name,
        brandId: products.brandId,
        brandName: brands.name,
        overallRating: products.overallRating,
        totalReviews: products.totalReviews,
        isuraVerified: products.isuraVerified,
        // Use sql template for complex expressions like MIN()
        price: sql<number>`MIN(${productVariants.price})`.as("price"),
        currency: productVariants.currency,
        imageUrl: productImages.imageUrl,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.brandId))
      .leftJoin(productVariants, eq(products.productId, productVariants.productId))
      .leftJoin(
        productImages,
        and(
          eq(products.productId, productImages.productId),
          eq(productImages.isThumbnail, true)
        )
      );

    // Build conditions using sql.empty() and append
    let conditions = sql.empty();
    let isFirstCondition = true;

    // If filtering by category, join with productCategories
    if (categoryId) {
      queryBuilder.innerJoin(
        productCategories,
        eq(products.productId, productCategories.productId)
      );

      if (isFirstCondition) {
        conditions = sql`${productCategories.categoryId} = ${categoryId}`;
        isFirstCondition = false;
      } else {
        conditions.append(sql` AND ${productCategories.categoryId} = ${categoryId}`);
      }
    }

    // Add brand filter
    if (brandId) {
      if (isFirstCondition) {
        conditions = sql`${products.brandId} = ${brandId}`;
        isFirstCondition = false;
      } else {
        conditions.append(sql` AND ${products.brandId} = ${brandId}`);
      }
    }

    // Add rating filter
    if (minRating) {
      if (isFirstCondition) {
        conditions = sql`${products.overallRating} >= ${minRating}`;
        isFirstCondition = false;
      } else {
        conditions.append(sql` AND ${products.overallRating} >= ${minRating}`);
      }
    }

    // Add price filters
    if (minPrice) {
      if (isFirstCondition) {
        conditions = sql`${productVariants.price} >= ${minPrice}`;
        isFirstCondition = false;
      } else {
        conditions.append(sql` AND ${productVariants.price} >= ${minPrice}`);
      }
    }

    if (maxPrice) {
      if (isFirstCondition) {
        conditions = sql`${productVariants.price} <= ${maxPrice}`;
        isFirstCondition = false;
      } else {
        conditions.append(sql` AND ${productVariants.price} <= ${maxPrice}`);
      }
    }

    // Apply WHERE conditions if any exist
    if (!isFirstCondition) {
      queryBuilder.where(conditions);
    }

    // Add GROUP BY clause
    queryBuilder.groupBy(
      products.productId,
      brands.name,
      productVariants.currency,
      productImages.imageUrl
    );

    // Apply sorting using SQL templates for more complex cases
    switch (sortBy) {
      case "price_asc":
        queryBuilder.orderBy(sql`MIN(${productVariants.price}) ASC`);
        break;
      case "price_desc":
        queryBuilder.orderBy(sql`MIN(${productVariants.price}) DESC`);
        break;
      case "newest":
        queryBuilder.orderBy(desc(products.dateFirstAvailable));
        break;
      case "popularity":
        queryBuilder.orderBy(desc(products.overallRating));
        break;
      default:
        queryBuilder.orderBy(desc(products.totalReviews));
        break;
    }

    // Apply pagination
    queryBuilder.limit(pageSize).offset((page - 1) * pageSize);

    // Execute the query
    return await queryBuilder;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}



export async function getProductDetail(productId: number) {
  try {
    // Get product basic info
    const productInfo = await db
      .select({
        productId: products.productId,
        name: products.name,
        brandId: products.brandId,
        brandName: brands.name,
        overallRating: products.overallRating,
        totalReviews: products.totalReviews,
        totalQuestions: products.totalQuestions,
        detailedDescription: products.detailedDescription,
        baseDescription: products.baseDescription,
        suggestedUse: products.suggestedUse,
        otherIngredients: products.otherIngredients,
        warnings: products.warnings,
        disclaimer: products.disclaimer,
        isuraVerified: products.isuraVerified,
        nonGmoDocumentation: products.nonGmoDocumentation,
        massSpecLabTested: products.massSpecLabTested,
        dateFirstAvailable: products.dateFirstAvailable,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.brandId))
      .where(eq(products.productId, productId))
      .limit(1);

    // Get product images
    const images = await db
      .select({
        imageId: productImages.imageId,
        imageUrl: productImages.imageUrl,
        altText: productImages.altText,
        isThumbnail: productImages.isThumbnail,
        displayOrder: productImages.displayOrder,
      })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(asc(productImages.displayOrder));

    // Get product variants
    const variants = await db
      .select({
        variantId: productVariants.variantId,
        packageDescription: productVariants.packageDescription,
        price: productVariants.price,
        currency: productVariants.currency,
        listPrice: productVariants.listPrice,
        servingSize: productVariants.servingSize,
        servingsPerContainer: productVariants.servingsPerContainer,
        isInStock: productVariants.isInStock,
      })
      .from(productVariants)
      .where(eq(productVariants.productId, productId));

    // For each variant, get supplement facts
    const variantsWithFacts = await Promise.all(
      variants.map(async (variant) => {
        const facts = await db
          .select({
            factId: supplementFacts.factId,
            ingredientName: supplementFacts.ingredientName,
            amountPerServing: supplementFacts.amountPerServing,
            percentDailyValue: supplementFacts.percentDailyValue,
            displayOrder: supplementFacts.displayOrder,
          })
          .from(supplementFacts)
          .where(eq(supplementFacts.variantId, variant.variantId))
          .orderBy(asc(supplementFacts.displayOrder));

        return { ...variant, supplementFacts: facts };
      })
    );

    // Get categories
    const categoryList = await db
      .select({
        categoryId: categories.categoryId,
        name: categories.name,
      })
      .from(productCategories)
      .innerJoin(
        categories,
        eq(productCategories.categoryId, categories.categoryId)
      )
      .where(eq(productCategories.productId, productId));

    return {
      ...productInfo[0],
      images,
      variants: variantsWithFacts,
      categories: categoryList,
    };
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return null;
  }
}

export async function getProductReviews(
  productId: number,
  pageSize = 10,
  sortBy: "helpful" | "recent" | "highest" | "lowest" = "helpful",
  cursor?: string
) {
  try {
    // Parse the Base64-encoded cursor, if provided.
    let cursorData: { id: number; value: number | string } | undefined;
    if (cursor) {
      try {
        const decoded = Buffer.from(cursor, "base64").toString("utf8");
        cursorData = JSON.parse(decoded);
      } catch (e) {
        console.error("Invalid cursor format:", e);
      }
    }

    // Build the dynamic cursor condition.
    let cursorCondition = sql.raw(""); // empty SQL fragment by default
    if (cursorData) {
      switch (sortBy) {
        case "recent": {
          // Assume review_date is stored as a timestamp
          const cursorDate = new Date(cursorData.value);
          cursorCondition = sql`(
            r.review_date < ${cursorDate} OR
            (r.review_date = ${cursorDate} AND r.review_id < ${cursorData.id})
          )`;
          break;
        }
        case "highest":
          cursorCondition = sql`(
            r.rating < ${cursorData.value} OR
            (r.rating = ${cursorData.value} AND r.review_id < ${cursorData.id})
          )`;
          break;
        case "lowest":
          cursorCondition = sql`(
            r.rating > ${cursorData.value} OR
            (r.rating = ${cursorData.value} AND r.review_id < ${cursorData.id})
          )`;
          break;
        case "helpful":
          cursorCondition = sql`(
            r.helpful_votes < ${cursorData.value} OR
            (r.helpful_votes = ${cursorData.value} AND r.review_id < ${cursorData.id})
          )`;
          break;
        default:
          cursorCondition = sql`(
            r.helpful_votes < ${cursorData.value} OR
            (r.helpful_votes = ${cursorData.value} AND r.review_id < ${cursorData.id})
          )`;
          break;
      }
    }

    // Build the WHERE clause. Start with the productId filter.
    let whereClause = sql`r.product_id = ${productId}`;
    if (cursorData) {
      whereClause = sql`${whereClause} AND ${cursorCondition}`;
    }

    // Build the ORDER BY clause based on the sort type.
    let orderByClause = sql``;
    switch (sortBy) {
      case "recent":
        orderByClause = sql`ORDER BY r.review_date DESC, r.review_id DESC`;
        break;
      case "highest":
        orderByClause = sql`ORDER BY r.rating DESC, r.review_id DESC`;
        break;
      case "lowest":
        orderByClause = sql`ORDER BY r.rating ASC, r.review_id DESC`;
        break;
      case "helpful":
        orderByClause = sql`ORDER BY r.helpful_votes DESC, r.review_id DESC`;
        break;
      default:
        orderByClause = sql`ORDER BY r.helpful_votes DESC, r.review_id DESC`;
        break;
    }

    // Calculate the limit (fetch one extra row to signal a next page)
    const limitValue = pageSize + 1;

    // Assemble the final SQL query.
    // Note: In this example, we assume the reviews table is aliased as "r"
    // and the user table (which holds the reviewer's name) is aliased as "u".
    // If your user table is named differently (or is a reserved word), adjust accordingly.
    const mainQuery = sql`
      SELECT
        r.review_id AS "reviewId",
        r.rating AS "rating",
        r.review_title AS "reviewTitle",
        r.review_text AS "reviewText",
        r.review_date AS "reviewDate",
        r.helpful_votes AS "helpfulVotes",
        r.not_helpful_votes AS "notHelpfulVotes",
        r.is_verified_purchase AS "isVerifiedPurchase",
        u.name AS "userName",
        r.reviewer_location AS "reviewerLocation"
      FROM reviews r
      INNER JOIN "user" u ON r.user_id = u.id
      WHERE ${whereClause}
      ${orderByClause}
      LIMIT ${limitValue}
    `;

    // Execute the main query.
    const { rows: reviewRows } = await db.execute(mainQuery);

    // Determine if we have a next page, and slice the extra row if present.
    const hasNextPage = reviewRows.length > pageSize;
    const pagedReviews = hasNextPage ? reviewRows.slice(0, pageSize) : reviewRows;

    // Prepare the next cursor (if applicable) using the last review.
    let nextCursor: string | undefined = undefined;
    if (hasNextPage && pagedReviews.length > 0) {
      const lastReview = pagedReviews[pagedReviews.length - 1];
      let cursorValue: number | string;
      switch (sortBy) {
        case "recent":
          cursorValue = lastReview.reviewDate;
          break;
        case "highest":
        case "lowest":
          cursorValue = lastReview.rating;
          break;
        case "helpful":
          cursorValue = lastReview.helpfulVotes;
          break;
        default:
          cursorValue = lastReview.helpfulVotes;
          break;
      }
      const cursorObj = { id: lastReview.reviewId, value: cursorValue };
      nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString("base64");
    }

    // For each review, fetch any review images (using a raw query as well).
    // Adjust table/column names as needed.
    const reviewsWithImages = await Promise.all(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      pagedReviews.map(async (rev: any) => {
        const imagesQuery = sql`
          SELECT
            review_image_id AS "reviewImageId",
            image_url AS "imageUrl",
            alt_text AS "altText"
          FROM review_images
          WHERE review_id = ${rev.reviewId}
        `;
        const { rows: imageRows } = await db.execute(imagesQuery);
        return { ...rev, images: imageRows };
      })
    );

    // Get total reviews count for this product
    const countQuery = sql`
      SELECT count(*) AS "count"
      FROM reviews r
      WHERE r.product_id = ${productId}
    `;
    const { rows: countRows } = await db.execute(countQuery);
    const totalCount = Number(countRows[0]?.count ?? 0);

    return {
      reviews: reviewsWithImages,
      pagination: {
        totalItems: totalCount,
        hasNextPage,
        nextCursor,
      },
    };
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return {
      reviews: [],
      pagination: {
        totalItems: 0,
        hasNextPage: false,
        nextCursor: undefined,
      },
    };
  }
}

export async function getProductQuestions(
  productId: number,
  page = 1,
  pageSize = 10
) {
  try {
    const questionsQuery = await db
      .select({
        questionId: questions.questionId,
        questionText: questions.questionText,
        questionDate: questions.questionDate,
        upvotes: questions.upvotes,
        downvotes: questions.downvotes,
        userName: user.name, // Assuming 'name' exists in your user table
      })
      .from(questions)
      .innerJoin(user, eq(questions.userId, user.id))
      .where(eq(questions.productId, productId))
      .orderBy(desc(questions.upvotes))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const questionsWithAnswers = await Promise.all(
      questionsQuery.map(async (question) => {
        const answerList = await db
          .select({
            answerId: answers.answerId,
            answerText: answers.answerText,
            answerDate: answers.answerDate,
            isBestAnswer: answers.isBestAnswer,
            isVerifiedPurchase: answers.isVerifiedPurchase,
            upvotes: answers.upvotes,
            downvotes: answers.downvotes,
            userName: user.name, // Assuming 'name' exists in your user table
          })
          .from(answers)
          .innerJoin(user, eq(answers.userId, user.id))
          .where(eq(answers.questionId, question.questionId))
          .orderBy(desc(answers.isBestAnswer), desc(answers.upvotes));

        return { ...question, answers: answerList };
      })
    );

    // Get total questions count for pagination
    const [{ countRows }] = await db
      .select({ countRows: count() })
      .from(questions)
      .where(eq(questions.productId, productId));

    return {
      questions: questionsWithAnswers,
      pagination: {
        totalItems: Number(countRows),
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(Number(count) / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching product questions:", error);
    return {
      questions: [],
      pagination: { totalItems: 0, currentPage: 1, pageSize, totalPages: 0 },
    };
  }
}

export async function searchProducts(
  queryStr: string,
  page = 1,
  pageSize = 20,
  filters?: {
    categoryId?: number;
    brandId?: number;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  }
): Promise<{
  products: Array<{
    productId: number;
    name: string;
    brandId: number;
    brandName: string;
    overallRating: number;
    totalReviews: number;
    price: number;
    currency: string;
    imageUrl: string;
  }>;
  pagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}> {
  try {
    if (!queryStr.trim()) {
      return {
        products: [],
        pagination: {
          totalItems: 0,
          currentPage: 1,
          pageSize,
          totalPages: 0,
        },
      };
    }

    // Build a search pattern for ILIKE queries
    const searchPattern = `%${queryStr}%`;

    // Dynamically add an INNER JOIN on product_categories if filtering by category
    const joinCategory = filters?.categoryId
      ? sql`INNER JOIN product_categories pc ON p.product_id = pc.product_id`
      : sql.raw("");

    // Additional WHERE filters
    const brandFilter = filters?.brandId
      ? sql`AND p.brand_id = ${filters.brandId}`
      : sql.raw("");
    const ratingFilter = filters?.minRating
      ? sql`AND p.overall_rating >= ${filters.minRating}`
      : sql.raw("");

    // Build the HAVING clause for price filters.
    // Note: Since price uses an aggregate (MIN), we cannot place these in the WHERE clause.
    let havingClause = sql.raw("");
    if (filters?.minPrice || filters?.maxPrice) {
      if (filters.minPrice && filters.maxPrice) {
        havingClause = sql`HAVING MIN(pv.price) >= ${filters.minPrice} AND MIN(pv.price) <= ${filters.maxPrice}`;
      } else if (filters.minPrice) {
        havingClause = sql`HAVING MIN(pv.price) >= ${filters.minPrice}`;
      } else if (filters.maxPrice) {
        havingClause = sql`HAVING MIN(pv.price) <= ${filters.maxPrice}`;
      }
    }

    // Assemble the main query as a raw SQL statement.
    // p, b, pv, pi, and pc are aliases for products, brands, product_variants, product_images, and product_categories respectively.
    const mainQuery = sql`
      SELECT
        p.product_id AS "productId",
        p.name AS "name",
        p.brand_id AS "brandId",
        b.name AS "brandName",
        p.overall_rating AS "overallRating",
        p.total_reviews AS "totalReviews",
        MIN(pv.price) AS "price",
        pv.currency AS "currency",
        pi.image_url AS "imageUrl"
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_variants pv ON p.product_id = pv.product_id
      LEFT JOIN product_images pi
        ON p.product_id = pi.product_id AND pi.is_thumbnail = true
      ${joinCategory}
      WHERE (
        p.name ILIKE ${searchPattern} OR
        b.name ILIKE ${searchPattern} OR
        p.base_description ILIKE ${searchPattern}
      )
      ${filters?.categoryId ? sql`AND pc.category_id = ${filters.categoryId}` : sql.raw("")}
      ${brandFilter}
      ${ratingFilter}
      GROUP BY p.product_id, b.name, pv.currency, pi.image_url
      ${havingClause}
      ORDER BY p.total_reviews DESC
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `;

    // Execute the main query
    const { rows: productRows } = await db.execute(mainQuery);

    // Build the count query to determine total matching products.
    // (Price filters are omitted from the count query since they affect the grouping.)
    const countJoinCategory = filters?.categoryId
      ? sql`INNER JOIN product_categories pc ON p.product_id = pc.product_id`
      : sql.raw("");
    const countQuery = sql`
      SELECT count(*) AS "count"
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      ${countJoinCategory}
      WHERE (
        p.name ILIKE ${searchPattern} OR
        b.name ILIKE ${searchPattern} OR
        p.base_description ILIKE ${searchPattern}
      )
      ${filters?.categoryId ? sql`AND pc.category_id = ${filters.categoryId}` : sql.raw("")}
      ${brandFilter}
      ${ratingFilter}
    `;

    const { rows: countRows } = await db.execute(countQuery);
    const totalCount = Number(countRows[0]?.count ?? 0);

    return {
      products: productRows,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      products: [],
      pagination: {
        totalItems: 0,
        currentPage: 1,
        pageSize,
        totalPages: 0,
      },
    };
  }
}
