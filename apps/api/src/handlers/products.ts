import { Hono } from "hono";
import { searchProducts } from "../services/products";
import * as service from '../services'
import { HTTPException } from "hono/http-exception";

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

handler.get('/details/:id', async (c) => {
  const { id } = c.req.param();

  if (Number.isNaN(Number.parseInt(id))) {
    throw new HTTPException(400, { message: 'Invalid product ID' });
  }

  const product = await service.productService.getProductDetail(Number.parseInt(id));

  if (!product) {
    throw new HTTPException(404, { message: 'Product not found' });
  }

  return c.json({
    data: product
  });
})

export default handler;
