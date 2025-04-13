import { brands } from "@workspace/db/src/schema";
import { eq } from "drizzle-orm";
import { db } from '../../../../packages/db/src/index';

// Brand actions
export async function getBrands() {
  return await db.select().from(brands);
}

export async function getBrand(id: number) {
  const result = await db.select().from(brands).where(eq(brands.brandId, id));
  return result[0];
}

export async function createBrand(data: typeof brands.$inferInsert) {
  await db.insert(brands).values(data);
}

export async function updateBrand(id: number, data: Partial<typeof brands.$inferInsert>) {
  await db.update(brands).set(data).where(eq(brands.brandId, id));
}

export async function deleteBrand(id: number) {
  await db.delete(brands).where(eq(brands.brandId, id));
}
