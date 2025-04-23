import { Hono } from "hono";
import { searchProducts } from "../services/products";

const handler = new Hono();

handler.get("/search", async (c) => {
  try {
    const {
      q,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      minRating,
      page,
      pageSize,
    } = c.req.query();

    if (!q) {
      return c.json({ success: false, error: "Search query is required" }, 400);
    }

    const results = await searchProducts(
      q,
      page ? Number.parseInt(page) : 1,
      pageSize ? Number.parseInt(pageSize) : 20,
      {
        categoryId: categoryId ? Number.parseInt(categoryId) : undefined,
        brandId: brandId ? Number.parseInt(brandId) : undefined,
        minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
        minRating: minRating ? Number.parseFloat(minRating) : undefined,
      }
    );

    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("Error in search route:", error);
    return c.json({ success: false, error: "Search failed" }, 500);
  }
});

export default handler;
