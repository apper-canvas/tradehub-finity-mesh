import ordersData from '@/services/mockData/orders.json';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let orders = [...ordersData];

const orderService = {
  async getAll() {
    await delay(500);
    return orders.map(order => ({ ...order }));
  },

  async getByUserId(userId) {
    await delay(500);
    return orders
      .filter(order => order.userId === userId)
      .map(order => ({ ...order }))
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  },

  async getById(id) {
    await delay(300);
    const order = orders.find(o => o.Id === parseInt(id));
    return order ? { ...order } : null;
  },

  async updateStatus(id, status) {
    await delay(400);
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Order not found');
    }
    orders[index] = { ...orders[index], status };
    return { ...orders[index] };
  },

  async searchOrders(userId, searchTerm) {
    await delay(300);
    if (!searchTerm || searchTerm.trim() === '') {
      return this.getByUserId(userId);
    }

    const term = searchTerm.toLowerCase();
    const userOrders = orders.filter(order => order.userId === userId);

    return userOrders
      .filter(order => {
        return (
          order.orderNumber.toLowerCase().includes(term) ||
          order.product.title.toLowerCase().includes(term) ||
          order.seller.name.toLowerCase().includes(term) ||
          order.status.toLowerCase().includes(term)
        );
      })
      .map(order => ({ ...order }))
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  },

  async filterOrders(userId, filters) {
    await delay(400);
    let filtered = orders.filter(order => order.userId === userId);

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(order => new Date(order.orderDate) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => new Date(order.orderDate) <= toDate);
    }

    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      filtered = filtered.filter(order => order.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      filtered = filtered.filter(order => order.price <= parseFloat(filters.maxPrice));
    }

    return filtered
      .map(order => ({ ...order }))
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  },

  async getOrderStats(userId) {
    await delay(300);
    const userOrders = orders.filter(order => order.userId === userId);
    
    const totalPurchases = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + order.price, 0);
    const pendingOrders = userOrders.filter(order => 
      order.status === 'pending' || order.status === 'processing'
    ).length;

    return {
      totalPurchases,
      totalSpent,
      pendingOrders
    };
  }
};

export default orderService;