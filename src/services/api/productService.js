import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let products = [...productsData];

const productService = {
  async getAll() {
    await delay(300);
    return products.filter(p => p.status === "active").map(p => ({ ...p }));
  },

  async getById(id) {
    await delay(250);
    const product = products.find(p => p.Id === parseInt(id));
    return product ? { ...product } : null;
  },

  async getByCategory(categoryId) {
    await delay(300);
    return products
      .filter(p => p.category === categoryId && p.status === "active")
      .map(p => ({ ...p }));
  },

  async search(query, filters = {}) {
    await delay(350);
    let results = products.filter(p => p.status === "active");

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }

    if (filters.condition) {
      results = results.filter(p => p.condition === filters.condition);
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice);
    }

    return results.map(p => ({ ...p }));
  },

  async create(item) {
    await delay(400);
    const maxId = Math.max(...products.map(p => p.Id), 0);
    const newProduct = {
      ...item,
      Id: maxId + 1,
      datePosted: new Date().toISOString(),
      status: "active"
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  async update(id, data) {
    await delay(300);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...data };
      return { ...products[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(250);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      products.splice(index, 1);
      return true;
    }
    return false;
  },

  async getMyListings(sellerId) {
    await delay(300);
    return products
      .filter(p => p.sellerId === sellerId)
      .map(p => ({ ...p }));
  }
};

export default productService;