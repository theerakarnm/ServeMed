import { z } from 'zod';
// Schema for product validation
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brandId: z.number().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  discountPrice: z.coerce.number().min(0, "Discount price must be a positive number").nullable().optional(),
  stockQuantity: z.coerce.number().int().min(0, "Stock quantity must be a non-negative integer"),
  description: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),
  manufacturingDate: z.string().nullable().optional(),
  batchNumber: z.string().nullable().optional(),
  weight: z.coerce.number().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isAvailable: z.boolean().default(true),
  sku: z.string().nullable().optional(),
  upc: z.string().nullable().optional(),
  vsCode: z.string().nullable().optional(),
  categoryIds: z.array(z.number()).optional(),
})
