import sellersData from "@/services/mockData/sellers.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let sellers = [...sellersData];

const sellerService = {
  async getAll() {
    await delay(200);
    return sellers.map(s => ({ ...s }));
  },

  async getById(id) {
    await delay(150);
    const seller = sellers.find(s => s.id === id);
    return seller ? { ...seller } : null;
  }
};

export default sellerService;