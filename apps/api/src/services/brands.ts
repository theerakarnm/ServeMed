import { db } from "@workspace/db";
import { brands, categories, productCategories, productImages, products, productVariants } from "@workspace/db/src/schema";
import { sql } from "drizzle-orm";

export async function getFeaturedBrands(limit = 6) {
  try {
    const query = sql`
      SELECT
        brand_id AS "brandId",
        name
      FROM ${brands}
      ORDER BY name ASC
      LIMIT ${limit}
    `;

    const { rows } = await db.execute(query);
    return rows;
  } catch (error) {
    console.error("Error fetching featured brands:", error);
    return [];
  }
}
