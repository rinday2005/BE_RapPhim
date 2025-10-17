// src/seed/seedCombo.js
import Combo from "../model/Combo.js";
import { comboData } from "../../data/combos.js";

export const seedCombos = async () => {
  try {
    const existingCount = await Combo.countDocuments();
    if (existingCount > 0) {
      console.log("✅ Combo đã tồn tại, bỏ qua seed.");
      return;
    }

    // Loại bỏ các trường MongoDB không cần thiết (nếu có)
    const cleanCombos = comboData.map((combo) => ({
      comboId: combo.comboId,
      name: combo.name,
      description: combo.description,
      price: combo.price,
      originalPrice: combo.originalPrice,
      image: combo.image,
      items: combo.items,
      discount: combo.discount,
      isActive: combo.isActive,
      category: combo.category,
      createdAt: combo.createdAt,
      updatedAt: combo.updatedAt,
    }));

    await Combo.insertMany(cleanCombos);

    console.log(`🍿 Seeded ${cleanCombos.length} combo mẫu thành công!`);
  } catch (error) {
    console.error("❌ Lỗi khi seed combo:", error.message);
  }
};