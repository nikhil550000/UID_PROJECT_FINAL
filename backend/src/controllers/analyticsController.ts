import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const analyticsController = {
  // Get comprehensive dashboard statistics
  getDashboardStats: async (req: Request, res: Response) => {
    try {
      // Get basic counts
      const [medicineCount, storeCount, userCount, supplyCount, orderCount] = await Promise.all([
        prisma.medicine.count(),
        prisma.medicalStore.count(),
        prisma.user.count(),
        prisma.supply.count(),
        prisma.order.count()
      ]);

      // Get total inventory value
      const medicines = await prisma.medicine.findMany({
        select: {
          price: true,
          stock_quantity: true
        }
      });

      const totalInventoryValue = medicines.reduce((sum, medicine) => {
        return sum + (Number(medicine.price) * medicine.stock_quantity);
      }, 0);

      // Get low stock count
      const lowStockResult = await prisma.$queryRaw<Array<{count: bigint}>>`
        SELECT COUNT(*) as count FROM medicines 
        WHERE stock_quantity <= minimum_stock
      `;
      const lowStockCount = Number(lowStockResult[0]?.count || 0n);

      // Get expiring medicines count (next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiringCount = await prisma.medicine.count({
        where: {
          date_of_expiry: {
            lte: thirtyDaysFromNow
          }
        }
      });

      // Get pending orders count
      const pendingOrdersCount = await prisma.order.count({
        where: {
          status: 'pending'
        }
      });

      // Get monthly statistics for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyStats = await prisma.$queryRaw<Array<{
        month: number;
        year: number;
        order_count: bigint;
        total_order_value: string;
      }>>`
        SELECT 
          EXTRACT(MONTH FROM order_date)::integer as month,
          EXTRACT(YEAR FROM order_date)::integer as year,
          COUNT(*) as order_count,
          COALESCE(SUM(quantity * (SELECT price FROM medicines WHERE id = orders.medicine_id)), 0) as total_order_value
        FROM orders 
        WHERE order_date >= ${sixMonthsAgo}
        GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
        ORDER BY year, month
      `;

      return res.status(200).json({
        success: true,
        data: {
          counts: {
            medicines: medicineCount,
            stores: storeCount,
            users: userCount,
            supplies: supplyCount,
            orders: orderCount,
            lowStock: lowStockCount,
            expiringMedicines: expiringCount,
            pendingOrders: pendingOrdersCount
          },
          values: {
            totalInventoryValue: Math.round(totalInventoryValue),
            currency: 'USD'
          },
          trends: {
            monthly: monthlyStats.map(stat => ({
              month: stat.month.toString(),
              year: stat.year.toString(),
              order_count: Number(stat.order_count).toString(),
              supply_count: '0',
              total_order_value: stat.total_order_value,
              total_supply_value: '0'
            }))
          }
        },
        message: 'Dashboard statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting dashboard statistics:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve dashboard statistics'
      });
    }
  },

  // Get medicine categories for analytics
  getMedicineCategories: async (req: Request, res: Response) => {
    try {
      const categories = await prisma.$queryRaw<Array<{
        company: string;
        count: string;
        total_value: string;
        total_stock: string;
      }>>`
        SELECT 
          company,
          COUNT(*) as count,
          SUM(price * stock_quantity) as total_value,
          SUM(stock_quantity) as total_stock
        FROM medicines 
        GROUP BY company
        ORDER BY total_value DESC
      `;

      return res.status(200).json({
        success: true,
        data: categories.map(cat => ({
          company: cat.company,
          count: parseInt(cat.count),
          totalValue: Math.round(Number(cat.total_value)),
          totalStock: parseInt(cat.total_stock)
        })),
        message: 'Medicine categories retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting medicine categories:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve medicine categories'
      });
    }
  },

  // Get supply trends
  getSupplyTrends: async (req: Request, res: Response) => {
    try {
      const trends = await prisma.$queryRaw<Array<{
        month: string;
        year: string;
        supply_count: string;
        total_quantity: string;
        total_value: string;
      }>>`
        SELECT 
          EXTRACT(MONTH FROM supply_date) as month,
          EXTRACT(YEAR FROM supply_date) as year,
          COUNT(*) as supply_count,
          SUM(quantity) as total_quantity,
          SUM(quantity * (SELECT price FROM medicines WHERE id = supplies.medicine_id)) as total_value
        FROM supplies 
        WHERE supply_date >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY EXTRACT(YEAR FROM supply_date), EXTRACT(MONTH FROM supply_date)
        ORDER BY year, month
      `;

      return res.status(200).json({
        success: true,
        data: trends.map(trend => ({
          month: parseInt(trend.month),
          year: parseInt(trend.year),
          supplyCount: parseInt(trend.supply_count),
          totalQuantity: parseInt(trend.total_quantity),
          totalValue: Math.round(Number(trend.total_value))
        })),
        message: 'Supply trends retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting supply trends:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve supply trends'
      });
    }
  },

  // Get order analytics
  getOrderAnalytics: async (req: Request, res: Response) => {
    try {
      // Order status distribution
      const statusDistribution = await prisma.$queryRaw<Array<{
        status: string;
        count: string;
      }>>`
        SELECT status, COUNT(*) as count
        FROM orders
        GROUP BY status
      `;

      // Monthly order trends
      const monthlyOrders = await prisma.$queryRaw<Array<{
        month: string;
        year: string;
        order_count: string;
        approved_count: string;
        rejected_count: string;
        pending_count: string;
      }>>`
        SELECT 
          EXTRACT(MONTH FROM order_date) as month,
          EXTRACT(YEAR FROM order_date) as year,
          COUNT(*) as order_count,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
        FROM orders 
        WHERE order_date >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
        ORDER BY year, month
      `;

      return res.status(200).json({
        success: true,
        data: {
          statusDistribution: statusDistribution.map(status => ({
            status: status.status,
            count: parseInt(status.count)
          })),
          monthlyTrends: monthlyOrders.map(order => ({
            month: parseInt(order.month),
            year: parseInt(order.year),
            totalOrders: parseInt(order.order_count),
            approved: parseInt(order.approved_count),
            rejected: parseInt(order.rejected_count),
            pending: parseInt(order.pending_count)
          }))
        },
        message: 'Order analytics retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting order analytics:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve order analytics'
      });
    }
  }
};

export default analyticsController;
