import { z } from 'zod';

export const salesDataSchema = z.object({
  id: z.string(),
  date: z.string(),
  productName: z.string(),
  productId: z.string().optional(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalAmount: z.number(),
  customerName: z.string().optional(),
  customerId: z.string().optional(),
  paymentStatus: z.enum(['paid', 'pending', 'partial']),
  category: z.string().optional(),
  customerAvatarUrl: z.string().url().optional(),
});


export const inventoryDataSchema = z.object({
  id: z.string(),
  productName: z.string(),
  currentStock: z.number(),
  unit: z.string(),
  reorderLevel: z.number(),
  status: z.enum(['ok', 'low', 'overstock']),
  costPrice: z.number(),
  sellingPrice: z.number(),
  category: z.string().optional(),
  lastRestocked: z.string().optional(),
});


export const customerDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  firstPurchase: z.string(),
  lastPurchase: z.string(),
  totalPurchases: z.number(),
  totalSpent: z.number(),
  averageOrderValue: z.number(),
  segment: z.enum(['high-value', 'regular', 'at-risk', 'lost']).optional(),
});
