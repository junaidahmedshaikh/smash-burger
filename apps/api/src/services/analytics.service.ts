import { Order } from '../models/Order.model.js';
import { User } from '../models/User.model.js';
import { Product } from '../models/Product.model.js';
import { Category } from '../models/Category.model.js';
import { IAdminDashboardStats, IOrder } from '@smashd/types';

export class AnalyticsService {
  static async getDashboardStats(): Promise<IAdminDashboardStats> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 1. Today's stats
    const todayOrders = await Order.find({
      createdAt: { $gte: startOfToday },
      paymentStatus: { $ne: 'failed' },
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const todayOrdersCount = todayOrders.length;

    // 2. All-time customers & AOV
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const allPaidOrders = await Order.find({ paymentStatus: 'paid' });
    const allRevenue = allPaidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const averageOrderValue = allPaidOrders.length > 0 ? Math.round(allRevenue / allPaidOrders.length) : 0;

    // 3. Pending orders
    const pendingOrdersCount = await Order.countDocuments({
      orderStatus: { $in: ['received', 'preparing', 'cooking'] },
    });

    // 4. Last 7 Days Revenue & Order Trends
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const pastOrders = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
      paymentStatus: { $ne: 'failed' },
    });

    const trendMap = new Map<string, { revenue: number; orders: number }>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateKey = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      trendMap.set(dateKey, { revenue: 0, orders: 0 });
    }

    pastOrders.forEach((order) => {
      const dateKey = new Date(order.createdAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      if (trendMap.has(dateKey)) {
        const curr = trendMap.get(dateKey)!;
        curr.revenue += order.total;
        curr.orders += 1;
      }
    });

    const revenueTrend = Array.from(trendMap.entries()).map(([date, val]) => ({
      date,
      revenue: val.revenue,
      orders: val.orders,
    }));

    // 5. Category distribution
    const categories = await Category.find();
    const categorySales = await Promise.all(
      categories.map(async (cat) => {
        const productsInCat = await Product.find({ category: cat._id }).select('_id');
        const prodIds = productsInCat.map((p) => p._id);
        const orderAgg = await Order.aggregate([
          { $unwind: '$items' },
          { $match: { 'items.product': { $in: prodIds } } },
          {
            $group: {
              _id: null,
              sales: { $sum: '$items.itemTotal' },
              count: { $sum: '$items.quantity' },
            },
          },
        ]);

        return {
          category: cat.name,
          sales: orderAgg[0]?.sales || 0,
          count: orderAgg[0]?.count || 0,
        };
      })
    );

    // 6. Top Selling Products
    const topProductsAgg = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          soldCount: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.itemTotal' },
        },
      },
      { $sort: { soldCount: -1 } },
      { $limit: 5 },
    ]);

    const topSellingProducts = topProductsAgg.map((item) => ({
      id: item._id ? item._id.toString() : '',
      name: item.name,
      image: item.image,
      soldCount: item.soldCount,
      revenue: item.revenue,
    }));

    // 7. Recent Orders
    const recentOrders = await Order.find()
      .populate('items.product', 'name image slug')
      .sort({ createdAt: -1 })
      .limit(6);

    return {
      todayRevenue,
      todayOrdersCount,
      totalCustomers,
      averageOrderValue,
      pendingOrdersCount,
      revenueTrend,
      categorySales: categorySales.filter((c) => c.count > 0 || c.sales > 0),
      topSellingProducts,
      recentOrders: recentOrders.map((o) => o.toJSON() as IOrder),
    };
  }
}
