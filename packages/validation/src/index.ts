import { z } from 'zod';

// ==========================================
// Authentication Schemas
// ==========================================
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number').optional(),
  avatarUrl: z.string().url().optional(),
});

export const addressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other']).default('Home'),
  street: z.string().min(3, 'Street address is required').max(200),
  landmark: z.string().max(100).optional(),
  city: z.string().min(2, 'City is required').max(60),
  state: z.string().min(2, 'State is required').max(60),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit Indian Pincode'),
  isDefault: z.boolean().optional().default(false),
});

// ==========================================
// Product & Customization Schemas
// ==========================================
export const customizationChoiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Choice name is required'),
  priceDelta: z.number().min(0, 'Price cannot be negative'),
  isDefault: z.boolean().optional().default(false),
  caloriesDelta: z.number().optional().default(0),
});

export const customizationOptionSchema = z.object({
  groupName: z.string().min(1, 'Group name is required (e.g. Patty, Cheese, Sauce)'),
  minSelect: z.number().int().min(0),
  maxSelect: z.number().int().min(1),
  choices: z.array(customizationChoiceSchema).min(1, 'Must have at least one choice'),
});

export const nutritionalInfoSchema = z.object({
  calories: z.number().min(0),
  proteinGrams: z.number().min(0),
  carbsGrams: z.number().min(0),
  fatGrams: z.number().min(0),
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().min(5, 'Short description is required').max(150),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional(),
  images: z.array(z.string().min(1)).min(1, 'At least one image is required'),
  category: z.string().min(1, 'Category ID is required'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  nutritionalInformation: nutritionalInfoSchema,
  customizationOptions: z.array(customizationOptionSchema).optional().default([]),
  spiceLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).default(0),
  preparationTimeMinutes: z.number().int().min(1).default(15),
  isFeatured: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
  isVegetarian: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const updateProductSchema = createProductSchema.partial();

// ==========================================
// Category Schemas
// ==========================================
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(50),
  slug: z.string().min(2).max(50).optional(),
  description: z.string().min(5).max(300),
  image: z.string().min(1, 'Image URL is required'),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

// ==========================================
// Cart & Order Schemas
// ==========================================
export const selectedCustomizationSchema = z.object({
  groupName: z.string(),
  choiceName: z.string(),
  priceDelta: z.number().min(0),
});

export const cartItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(20),
  selectedCustomizations: z.array(selectedCustomizationSchema).optional().default([]),
  specialInstructions: z.string().max(200).optional(),
});

export const orderQuoteRequestSchema = z.object({
  items: z.array(cartItemInputSchema).min(1, 'Cart cannot be empty'),
  couponCode: z.string().optional(),
});

export const createOrderSchema = z.object({
  customerDetails: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit phone number is required'),
  }),
  items: z.array(cartItemInputSchema).min(1, 'Order must have at least one item'),
  deliveryAddress: addressSchema.omit({ isDefault: true }),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['razorpay', 'cash_on_delivery', 'mock_card']).default('mock_card'),
  customerNotes: z.string().max(250).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'received',
    'preparing',
    'cooking',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ]),
  note: z.string().max(200).optional(),
});

// ==========================================
// Coupon Schemas
// ==========================================
export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').toUpperCase().trim(),
  orderSubtotal: z.number().min(0),
});

export const createCouponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase().trim(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive('Value must be positive'),
  minimumOrderValue: z.number().min(0).default(0),
  maximumDiscount: z.number().positive().optional(),
  expiresAt: z.string().datetime(),
  usageLimit: z.number().int().positive().default(100),
  isActive: z.boolean().default(true),
});

// ==========================================
// Review Schemas
// ==========================================
export const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters').max(500),
});

// Type inferences
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderQuoteInput = z.infer<typeof orderQuoteRequestSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
