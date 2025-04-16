import { brands } from "@workspace/db/src/schema";
import { and, desc, eq, gt, isNull, like } from "drizzle-orm";
import { db } from '../../../../packages/db/src/index';
import { PAGE_SIZE } from "~/config/pagination";

// Brand actions
export async function getBrands({
  context,
  cursor
}: {
  context?: string
  cursor?: number
} = {}) {
  const brandResultList = await db.select().from(brands)
    .where(
      and(
        context ? like(brands.name, context) : undefined,
        cursor ? gt(brands.brandId, cursor) : undefined,
        isNull(brands.deletedAt),
      )
    )
    .orderBy(desc(brands.brandId))
  // .limit(PAGE_SIZE)

  return brandResultList
}

export async function getBrand(id: number) {
  const result = await db.select().from(brands).where(eq(brands.brandId, id));
  return result[0];
}

export async function createBrand(data: typeof brands.$inferInsert) {
  await db.insert(brands).values(data);
}

export async function createManyBrand(data: typeof brands.$inferInsert[]) {
  await db.insert(brands).values(data);
}

export async function updateBrand(id: number, data: Partial<typeof brands.$inferInsert>) {
  await db.update(brands).set(data).where(eq(brands.brandId, id));
}

export async function deleteBrand(id: number) {
  await db.delete(brands).where(eq(brands.brandId, id));
}
