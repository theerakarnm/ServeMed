"use server";

import { brands, categories, products, productVariants, productImages, supplementFacts, productRankings, productCategories } from "@workspace/db/src/schema";
import { and, eq, or } from "drizzle-orm";
import { db } from '../../../../packages/db/src/index';

// Brand actions
export async function getBrands() {
  return await db.select().from(brands);
}

export async function getBrand(id: number) {
  const result = await db.select().from(brands).where(eq(brands.brandId, id));
  return result[0];
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createBrand(data: any) {
  await db.insert(brands).values(data);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function updateBrand(id: number, data: any) {
  await db.update(brands).set(data).where(eq(brands.brandId, id));
}

export async function deleteBrand(id: number) {
  await db.delete(brands).where(eq(brands.brandId, id));
}

// Category actions
export async function getCategories() {
  return await db.select().from(categories);
}

export async function getCategory(id: number) {
  const result = await db.select().from(categories).where(eq(categories.categoryId, id));
  return result[0];
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createCategory(data: any) {
  await db.insert(categories).values(data);
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function updateCategory(id: number, data: any) {
  await db.update(categories).set(data).where(eq(categories.categoryId, id));
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.categoryId, id));
}

// Product actions
export async function getProducts() {
  return await db.select().from(products);
}

export async function getProduct(id: number) {
  const result = await db.select().from(products).where(eq(products.productId, id));
  return result[0];
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createProduct(data: any) {
  await db.insert(products).values(data);
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function updateProduct(id: number, data: any) {
  await db.update(products).set(data).where(eq(products.productId, id));
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.productId, id));
}

// Product Variant actions
export async function getProductVariants(productId?: number) {
  if (productId) {
    return await db.select().from(productVariants).where(eq(productVariants.productId, productId));
  }
  return await db.select().from(productVariants);
}

export async function getProductVariant(id: number) {
  const result = await db.select().from(productVariants).where(eq(productVariants.variantId, id));
  return result[0];
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createProductVariant(data: any) {
  await db.insert(productVariants).values(data);
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function updateProductVariant(id: number, data: any) {
  await db.update(productVariants).set(data).where(eq(productVariants.variantId, id));
}

export async function deleteProductVariant(id: number, productId: number) {
  await db.delete(productVariants).where(eq(productVariants.variantId, id));
}

// Product Image actions
export async function getProductImages(productId?: number) {
  if (productId) {
    return await db.select().from(productImages).where(eq(productImages.productId, productId));
  }
  return await db.select().from(productImages);
}

export async function getProductImage(id: number) {
  const result = await db.select().from(productImages).where(eq(productImages.imageId, id));
  return result[0];
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createProductImage(data: any) {
  await db.insert(productImages).values(data);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function updateProductImage(id: number, data: any) {
  await db.update(productImages).set(data).where(eq(productImages.imageId, id));
}

export async function deleteProductImage(id: number, productId: number) {
  await db.delete(productImages).where(eq(productImages.imageId, id));
}

// Supplement Facts actions
export async function getSupplementFacts(variantId?: number) {
  if (variantId) {
    return await db.select().from(supplementFacts).where(eq(supplementFacts.variantId, variantId));
  }
  return await db.select().from(supplementFacts);
}

export async function getSupplementFact(id: number) {
  const result = await db.select().from(supplementFacts).where(eq(supplementFacts.factId, id));
  return result[0];
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createSupplementFact(data: any) {
  await db.insert(supplementFacts).values(data);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function updateSupplementFact(id: number, data: any) {
  await db.update(supplementFacts).set(data).where(eq(supplementFacts.factId, id));
}

export async function deleteSupplementFact(id: number, variantId: number) {
  await db.delete(supplementFacts).where(eq(supplementFacts.factId, id));
}

// Product Rankings actions
export async function getProductRankings(productId?: number) {
  if (productId) {
    return await db.select().from(productRankings).where(eq(productRankings.productId, productId));
  }
  return await db.select().from(productRankings);
}

export async function getProductRanking(id: number) {
  const result = await db.select().from(productRankings).where(eq(productRankings.rankingId, id));
  return result[0];
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createProductRanking(data: any) {
  await db.insert(productRankings).values(data);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function updateProductRanking(id: number, data: any) {
  await db.update(productRankings).set(data).where(eq(productRankings.rankingId, id));
}

export async function deleteProductRanking(id: number, productId: number) {
  await db.delete(productRankings).where(eq(productRankings.rankingId, id));
}

// Product Categories actions
export async function getProductCategories(productId?: number) {
  if (productId) {
    return await db.select().from(productCategories).where(eq(productCategories.productId, productId));
  }
  return await db.select().from(productCategories);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createProductCategory(data: any) {
  await db.insert(productCategories).values(data);
}

export async function deleteProductCategory(productId: number, categoryId: number) {
  await db.delete(productCategories)
    .where(and(eq(productCategories.productId, productId), eq(productCategories.categoryId, categoryId)))
}
