import { Hono } from "hono";
import * as service from "../services";

const handler = new Hono();

handler.get("/home", async (c) => {
  try {
    // Get all the data needed for the home page
    const [featuredProducts, topRankedProducts, newArrivals, featuredBrands, topCategories] =
      await Promise.all([
        service.productService.getFeaturedProducts(),
        service.productService.getTopRankedProducts(),
        service.productService.getNewArrivals(),
        service.brandService.getFeaturedBrands(),
        service.categoryService.getTopCategories(),
      ]);

    return c.json({
      success: true,
      data: {
        featuredProducts,
        topRankedProducts,
        newArrivals,
        featuredBrands,
        topCategories,
      },
    });
  } catch (error) {
    console.error("Error in home page route:", error);
    return c.json({ success: false, error: "Failed to fetch home page data" }, 500);
  }
});

export default handler;
