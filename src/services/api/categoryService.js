import categoriesData from "@/services/mockData/categories.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let categories = [...categoriesData];

const categoryService = {
  async getAll() {
    await delay(200);
    return categories.map(c => ({ ...c }));
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.id === id);
    return category ? { ...category } : null;
  }
};

export default categoryService;