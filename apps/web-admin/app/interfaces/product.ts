import type { productSchema } from '~/schema/product';
import type { z } from 'zod';

export type ProductFormData = z.infer<typeof productSchema>
