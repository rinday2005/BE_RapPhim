// Combo food & beverage data for backend
export const comboData = [
  {
    comboId: "COMBO001",
    name: "Combo Classic",
    description: "1 bắp + 1 nước",
    price: 80000,
    originalPrice: 100000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
    items: [
      { name: "Bắp ngô", quantity: 1, price: 50000 },
      { name: "Nước ngọt", quantity: 1, price: 25000 },
    ],
    discount: 20,
    isActive: true,
    category: "basic",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    comboId: "COMBO002",
    name: "Combo Family",
    description: "2 bắp + 2 nước + 1 snack",
    price: 150000,
    originalPrice: 200000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
    items: [
      { name: "Bắp ngô", quantity: 2, price: 100000 },
      { name: "Nước ngọt", quantity: 2, price: 50000 },
      { name: "Snack khoai tây", quantity: 1, price: 50000 },
    ],
    discount: 25,
    isActive: true,
    category: "family",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    comboId: "COMBO003",
    name: "Combo Premium",
    description: "2 bắp + 2 nước + 2 snack + 1 kẹo",
    price: 200000,
    originalPrice: 280000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
    items: [
      { name: "Bắp ngô", quantity: 2, price: 100000 },
      { name: "Nước ngọt", quantity: 2, price: 50000 },
      { name: "Snack khoai tây", quantity: 2, price: 100000 },
      { name: "Kẹo bạc hà", quantity: 1, price: 30000 },
    ],
    discount: 28,
    isActive: true,
    category: "premium",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    comboId: "COMBO004",
    name: "Combo Couple",
    description: "2 bắp + 2 nước + 1 snack + 1 kẹo",
    price: 120000,
    originalPrice: 160000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
    items: [
      { name: "Bắp ngô", quantity: 2, price: 100000 },
      { name: "Nước ngọt", quantity: 2, price: 50000 },
      { name: "Snack khoai tây", quantity: 1, price: 50000 },
      { name: "Kẹo socola", quantity: 1, price: 20000 },
    ],
    discount: 25,
    isActive: true,
    category: "couple",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    comboId: "COMBO005",
    name: "Combo Kids",
    description: "1 bắp nhỏ + 1 nước + 1 kẹo + 1 đồ chơi",
    price: 60000,
    originalPrice: 80000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
    items: [
      { name: "Bắp ngô nhỏ", quantity: 1, price: 30000 },
      { name: "Nước ngọt", quantity: 1, price: 25000 },
      { name: "Kẹo socola", quantity: 1, price: 15000 },
      { name: "Đồ chơi nhỏ", quantity: 1, price: 10000 },
    ],
    discount: 25,
    isActive: true,
    category: "kids",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    comboId: "COMBO006",
    name: "Combo VIP",
    description: "2 bắp + 2 nước premium + 2 snack + 1 kẹo + 1 bánh",
    price: 300000,
    originalPrice: 400000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
    items: [
      { name: "Bắp ngô", quantity: 2, price: 100000 },
      { name: "Nước premium", quantity: 2, price: 80000 },
      { name: "Snack cao cấp", quantity: 2, price: 120000 },
      { name: "Kẹo cao cấp", quantity: 1, price: 50000 },
      { name: "Bánh ngọt", quantity: 1, price: 50000 },
    ],
    discount: 25,
    isActive: true,
    category: "vip",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const foodItems = [
  {
    itemId: "FOOD001",
    name: "Bắp ngô",
    description: "Bắp ngô tươi, bơ và muối",
    price: 50000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
    category: "snack",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    itemId: "FOOD002",
    name: "Bắp ngô nhỏ",
    description: "Bắp ngô tươi, bơ và muối (size nhỏ)",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
    category: "snack",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    itemId: "FOOD003",
    name: "Nước ngọt",
    description: "Coca Cola, Pepsi, Sprite, Fanta",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
    category: "drink",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    itemId: "FOOD004",
    name: "Nước premium",
    description: "Nước ngọt nhập khẩu cao cấp",
    price: 40000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
    category: "drink",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    itemId: "FOOD005",
    name: "Snack khoai tây",
    description: "Khoai tây chiên giòn",
    price: 50000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
    category: "snack",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    itemId: "FOOD006",
    name: "Kẹo socola",
    description: "Kẹo socola ngọt ngào",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
    category: "candy",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Helper functions for backend
export const getComboById = (comboId) => {
  return comboData.find((combo) => combo.comboId === comboId);
};

export const getActiveCombos = () => {
  return comboData.filter((combo) => combo.isActive);
};

export const getCombosByCategory = (category) => {
  return comboData.filter(
    (combo) => combo.category === category && combo.isActive
  );
};

export const getFoodItemsByCategory = (category) => {
  return foodItems.filter(
    (item) => item.category === category && item.isAvailable
  );
};

export const getAvailableFoodItems = () => {
  return foodItems.filter((item) => item.isAvailable);
};

export const searchCombos = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return comboData.filter(
    (combo) =>
      combo.name.toLowerCase().includes(lowercaseQuery) ||
      combo.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const createCombo = (comboData) => {
  const newCombo = {
    comboId: `COMBO${String(comboData.length + 1).padStart(3, "0")}`,
    ...comboData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  comboData.push(newCombo);
  return newCombo;
};

export const updateCombo = (comboId, updateData) => {
  const index = comboData.findIndex((combo) => combo.comboId === comboId);
  if (index !== -1) {
    comboData[index] = {
      ...comboData[index],
      ...updateData,
      updatedAt: new Date(),
    };
    return comboData[index];
  }
  return null;
};

export const deleteCombo = (comboId) => {
  const index = comboData.findIndex((combo) => combo.comboId === comboId);
  if (index !== -1) {
    return comboData.splice(index, 1)[0];
  }
  return null;
};