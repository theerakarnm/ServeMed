// Get top categories (most popular or featured)
export async function getTopCategories() {
  try {
    // In a real app, you might query based on product count or manually featured categories
    return [
      { categoryId: 1, name: "Vitamins", productCount: 120 },
      { categoryId: 2, name: "Minerals", productCount: 85 },
      { categoryId: 3, name: "Probiotics", productCount: 64 },
      { categoryId: 4, name: "Omega-3", productCount: 42 },
      { categoryId: 5, name: "Protein", productCount: 78 },
      { categoryId: 6, name: "Herbs", productCount: 93 },
    ]
  } catch (error) {
    console.error("Error fetching top categories:", error)
    return []
  }
}

// Get top categories (most popular or featured)
export async function getProductCategories(productId: number) {
  try {
    // In a real app, you might query based on product count or manually featured categories
    return [
      { categoryId: 1, name: "Vitamins", productCount: 120 },
      { categoryId: 2, name: "Minerals", productCount: 85 },
      { categoryId: 3, name: "Probiotics", productCount: 64 },
      { categoryId: 4, name: "Omega-3", productCount: 42 },
      { categoryId: 5, name: "Protein", productCount: 78 },
      { categoryId: 6, name: "Herbs", productCount: 93 },
    ]
  } catch (error) {
    console.error("Error fetching top categories:", error)
    return []
  }
}

// Get featured products
export async function getFeaturedProducts() {
  try {
    // In a real app, you would query your database
    // For example: return db.select().from(products).orderBy(desc(products.totalReviews)).limit(4);
    return [
      {
        productId: 1,
        name: "Vitamin D3 + K2 Complex",
        brandId: 1,
        brandName: "NutriPure",
        overallRating: 4.8,
        totalReviews: 128,
        price: 24.99,
        currency: "USD",
        isuraVerified: true,
      },
      {
        productId: 2,
        name: "Omega-3 Fish Oil 1000mg",
        brandId: 2,
        brandName: "VitalLife",
        overallRating: 4.6,
        totalReviews: 95,
        price: 19.99,
        currency: "USD",
        isuraVerified: true,
      },
      {
        productId: 3,
        name: "Probiotic 50 Billion CFU",
        brandId: 3,
        brandName: "BioBalance",
        overallRating: 4.7,
        totalReviews: 112,
        price: 29.99,
        currency: "USD",
        isuraVerified: false,
      },
      {
        productId: 4,
        name: "Magnesium Glycinate",
        brandId: 1,
        brandName: "NutriPure",
        overallRating: 4.9,
        totalReviews: 87,
        price: 18.99,
        currency: "USD",
        isuraVerified: true,
      },
    ]
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

// Get featured brands
export async function getFeaturedBrands() {
  try {
    // In a real app: return db.select().from(brands).limit(6);
    return [
      { brandId: 1, name: "NutriPure" },
      { brandId: 2, name: "VitalLife" },
      { brandId: 3, name: "BioBalance" },
      { brandId: 4, name: "PureEssentials" },
      { brandId: 5, name: "NatureWay" },
      { brandId: 6, name: "OptimalHealth" },
    ]
  } catch (error) {
    console.error("Error fetching featured brands:", error)
    return []
  }
}

// Get top ranked products
export async function getTopRankedProducts() {
  try {
    // In a real app, you would join tables and query based on rankings
    return [
      {
        productId: 5,
        name: "Turmeric Curcumin with BioPerine",
        brandId: 4,
        brandName: "PureEssentials",
        overallRating: 4.9,
        totalReviews: 156,
        price: 22.99,
        currency: "USD",
        isuraVerified: true,
      },
      {
        productId: 6,
        name: "Zinc Picolinate 50mg",
        brandId: 5,
        brandName: "NatureWay",
        overallRating: 4.7,
        totalReviews: 78,
        price: 14.99,
        currency: "USD",
        isuraVerified: false,
      },
      {
        productId: 7,
        name: "Vitamin B Complex",
        brandId: 6,
        brandName: "OptimalHealth",
        overallRating: 4.8,
        totalReviews: 92,
        price: 21.99,
        currency: "USD",
        isuraVerified: true,
      },
      {
        productId: 8,
        name: "Ashwagandha KSM-66",
        brandId: 3,
        brandName: "BioBalance",
        overallRating: 4.6,
        totalReviews: 104,
        price: 27.99,
        currency: "USD",
        isuraVerified: true,
      },
    ]
  } catch (error) {
    console.error("Error fetching top ranked products:", error)
    return []
  }
}

// Get new arrivals
export async function getNewArrivals() {
  try {
    // In a real app: return db.select().from(products).orderBy(desc(products.dateFirstAvailable)).limit(4);
    return [
      {
        productId: 9,
        name: "Collagen Peptides Powder",
        brandId: 2,
        brandName: "VitalLife",
        overallRating: 4.5,
        totalReviews: 42,
        price: 34.99,
        currency: "USD",
        isuraVerified: true,
      },
      {
        productId: 10,
        name: "Quercetin with Bromelain",
        brandId: 1,
        brandName: "NutriPure",
        overallRating: 4.7,
        totalReviews: 28,
        price: 26.99,
        currency: "USD",
        isuraVerified: false,
      },
      {
        productId: 11,
        name: "Berberine HCl 500mg",
        brandId: 5,
        brandName: "NatureWay",
        overallRating: 4.8,
        totalReviews: 36,
        price: 29.99,
        currency: "USD",
        isuraVerified: true,
      },
      {
        productId: 12,
        name: "Lion's Mane Mushroom Extract",
        brandId: 6,
        brandName: "OptimalHealth",
        overallRating: 4.6,
        totalReviews: 31,
        price: 32.99,
        currency: "USD",
        isuraVerified: true,
      },
    ]
  } catch (error) {
    console.error("Error fetching new arrivals:", error)
    return []
  }
}
