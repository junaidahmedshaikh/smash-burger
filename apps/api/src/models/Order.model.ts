import mongoose, { Document, Schema, Types } from 'mongoose';
import {
  IOrder,
  IOrderItem,
  IOrderStatusHistory,
  ISelectedCustomization,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '@smashd/types';

export interface IOrderDocument extends Omit<IOrder, '_id' | 'id' | 'user' | 'items'>, Document {
  user?: Types.ObjectId;
  items: Array<Omit<IOrderItem, 'product'> & { product: Types.ObjectId }>;
}

const SelectedCustomizationSchema = new Schema<ISelectedCustomization>({
  groupName: { type: String, required: true },
  choiceName: { type: String, required: true },
  priceDelta: { type: Number, required: true, default: 0 },
});

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedCustomizations: [SelectedCustomizationSchema],
  itemTotal: { type: Number, required: true },
});

const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>({
  status: {
    type: String,
    enum: ['received', 'preparing', 'cooking', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  note: { type: String },
});

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    deliveryFee: { type: Number, default: 0 },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cash_on_delivery', 'mock_card'],
      default: 'mock_card',
    },
    paymentDetails: {
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      paidAt: { type: Date },
    },
    orderStatus: {
      type: String,
      enum: ['received', 'preparing', 'cooking', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'received',
      index: true,
    },
    statusHistory: [OrderStatusHistorySchema],
    deliveryAddress: {
      street: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    customerNotes: { type: String },
    estimatedDeliveryTime: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        if (ret._id) {
          ret.id = ret._id.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Order = mongoose.model<IOrderDocument>('Order', OrderSchema);
