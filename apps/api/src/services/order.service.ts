import { Order, IOrderDocument } from '../models/Order.model.js';
import { Product } from '../models/Product.model.js';
import { CouponService } from './coupon.service.js';
import { FALLBACK_ID_TO_SLUG } from './product.service.js';
import { AppError } from '../utils/response.js';
import { config } from '../config/index.js';
import { IOrder, IOrderItem, ISelectedCustomization, OrderStatus, PaymentStatus } from '@smashd/types';
import { CreateOrderInput, OrderQuoteInput } from '@smashd/validation';

export interface CalculatedOrderSummary {
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
}

export class OrderService {
  /**
   * Server-side calculation of order items, customizations, subtotals, tax, and discount
   */
  static async calculateQuote(input: OrderQuoteInput): Promise<CalculatedOrderSummary> {
    if (!input.items || input.items.length === 0) {
      throw new AppError('Cart must contain at least one item', 400, 'EMPTY_CART');
    }

    let subtotal = 0;
    const validatedItems: IOrderItem[] = [];

    for (const itemInput of input.items) {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(itemInput.productId);
      let product = null;

      if (isMongoId) {
        product = await Product.findById(itemInput.productId);
      } else {
        const slug = FALLBACK_ID_TO_SLUG[itemInput.productId] || itemInput.productId.toLowerCase();
        product = await Product.findOne({ slug });
      }

      if (!product) {
        throw new AppError(`Product with ID '${itemInput.productId}' not found`, 404, 'PRODUCT_NOT_FOUND');
      }

      if (!product.isAvailable) {
        throw new AppError(`'${product.name}' is currently sold out / unavailable`, 400, 'PRODUCT_UNAVAILABLE');
      }

      let itemUnitPrice = product.price;
      const verifiedCustomizations: ISelectedCustomization[] = [];

      // Validate customizations and calculate price deltas
      if (itemInput.selectedCustomizations && itemInput.selectedCustomizations.length > 0) {
        for (const custom of itemInput.selectedCustomizations) {
          const optionGroup = product.customizationOptions.find((g: any) => g.groupName === custom.groupName);
          if (optionGroup) {
            const choice = optionGroup.choices.find((c: any) => c.name === custom.choiceName);
            const delta = choice ? choice.priceDelta : 0;
            verifiedCustomizations.push({
              groupName: custom.groupName,
              choiceName: custom.choiceName,
              priceDelta: delta,
            });
            itemUnitPrice += delta;
          }
        }
      }

      const itemTotal = itemUnitPrice * itemInput.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        image: product.images[0] || '',
        unitPrice: itemUnitPrice,
        quantity: itemInput.quantity,
        selectedCustomizations: verifiedCustomizations,
        itemTotal,
      });
    }

    // Calculate coupon discount
    let discount = 0;
    let validCouponCode: string | undefined;

    if (input.couponCode) {
      const couponResult = await CouponService.validate(input.couponCode, subtotal);
      if (couponResult.isValid) {
        discount = couponResult.discountAmount;
        validCouponCode = couponResult.coupon.code;
      }
    }

    // Delivery Fee logic (Free delivery threshold)
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const deliveryFee = discountedSubtotal >= config.store.freeDeliveryThreshold ? 0 : config.store.deliveryFee;

    // GST Tax calculation on taxable food total
    const tax = Math.round((discountedSubtotal * config.store.taxPercentage) / 100);
    const total = discountedSubtotal + deliveryFee + tax;

    return {
      items: validatedItems,
      subtotal,
      discount,
      couponCode: validCouponCode,
      deliveryFee,
      tax,
      total,
    };
  }

  /**
   * Create official order and save to database
   */
  static async createOrder(input: CreateOrderInput, userId?: string): Promise<IOrder> {
    const summary = await this.calculateQuote({
      items: input.items,
      couponCode: input.couponCode,
    });

    const timestamp = Date.now().toString().slice(-5);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SMASH-${timestamp}-${randomSuffix}`;

    const estimatedDeliveryTime = new Date(Date.now() + 35 * 60 * 1000); // ~35 mins delivery window

    // If coupon was applied, increment usage count
    if (summary.couponCode) {
      await CouponService.incrementUsage(summary.couponCode);
    }

    const order = await Order.create({
      orderNumber,
      user: userId || undefined,
      customerDetails: input.customerDetails,
      items: summary.items,
      subtotal: summary.subtotal,
      discount: summary.discount,
      couponCode: summary.couponCode,
      deliveryFee: summary.deliveryFee,
      tax: summary.tax,
      total: summary.total,
      paymentStatus: input.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      paymentMethod: input.paymentMethod,
      paymentDetails: {
        paidAt: input.paymentMethod !== 'cash_on_delivery' ? new Date() : undefined,
      },
      orderStatus: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date(),
          note: 'Order confirmed and sent to grill station.',
        },
      ],
      deliveryAddress: input.deliveryAddress,
      customerNotes: input.customerNotes,
      estimatedDeliveryTime,
    });

    return order.toJSON() as IOrder;
  }

  static async getById(id: string): Promise<IOrder> {
    // Search by ObjectId or orderNumber
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { orderNumber: id };
    const order = await Order.findOne(query).populate('items.product', 'name images slug');

    if (!order) {
      throw new AppError(`Order '${id}' not found`, 404, 'ORDER_NOT_FOUND');
    }

    return order.toJSON() as IOrder;
  }

  static async getUserOrders(userId: string): Promise<IOrder[]> {
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 });

    return orders.map((o) => o.toJSON() as IOrder);
  }

  static async getAllOrders(params: { status?: OrderStatus; page?: number; limit?: number }): Promise<{
    orders: IOrder[];
    total: number;
    totalPages: number;
    page: number;
  }> {
    const { status, page = 1, limit = 20 } = params;
    const query: any = {};
    if (status) query.orderStatus = status;

    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const orders = await Order.find(query)
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      orders: orders.map((o) => o.toJSON() as IOrder),
      total,
      totalPages,
      page,
    };
  }

  static async updateStatus(orderId: string, newStatus: OrderStatus, note?: string): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    order.orderStatus = newStatus;
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      note: note || `Status advanced to ${newStatus.replace(/_/g, ' ')}`,
    });

    if (newStatus === 'delivered' && order.paymentMethod === 'cash_on_delivery') {
      order.paymentStatus = 'paid';
    }

    await order.save();
    return order.toJSON() as IOrder;
  }
}
