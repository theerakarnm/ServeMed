import HttpClient from "~/lib/http_client";
import { UrlBuilder } from "~/lib/url_builder";


export type ProductDetailResponse = {
  productId: number;
  name: string;
  brandId: number;
  brandName: string | null;
  overallRating: string | null;
  totalReviews: number;
  totalQuestions: number;
  detailedDescription: string | null;
  baseDescription: string | null;
  suggestedUse: string | null;
  otherIngredients: string | null;
  warnings: string | null;
  disclaimer: string | null;
  isuraVerified: boolean;
  nonGmoDocumentation: boolean | null;
  massSpecLabTested: boolean | null;
  dateFirstAvailable: Date | string | null;
  images: {
    imageId: number;
    imageUrl: string;
    altText: string | null;
    isThumbnail: boolean;
    displayOrder: number;
  }[];
  variants: {
    supplementFacts: {
      factId: number;
      ingredientName: string;
      amountPerServing: string;
      percentDailyValue: string | null;
      displayOrder: number;
    }[];
    variantId: number;
    packageDescription: string;
    price: string;
    currency: string;
    listPrice: string | null;
    servingSize: string | null;
    servingsPerContainer: number | null;
    isInStock: boolean;
  }
  categories: {
    categoryId: number;
    name: string;
  }[]
}


export const getProductById = async (productId: number) => {
  try {

    const url = new UrlBuilder({ path: 'PRODUCT_V1_DETAIL' }).param('id', productId).build();
    const response = await new HttpClient(url).get<{ data: ProductDetailResponse }>();

    return response.data;

  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}
