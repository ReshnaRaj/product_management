import Category from "../models/CategorySchema.js";
import SubCategory from "../models/SubCategorySchema.js";

/* ----------  POST /api/category  ---------- */
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    /* prevent duplicates */
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const newCat = await Category.create({ name: name.trim() });
    res.status(201).json({ message: "Category created", category: newCat });
  } catch (err) {
    console.error("Add Category error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Get Category error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------  POST /api/sub-category  ---------- */
export const addSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name?.trim() || !categoryId) {
      return res.status(400).json({ message: "Name and categoryId required" });
    }

    /* verify parent category exists */
    const parent = await Category.findById(categoryId);
    if (!parent) {
      return res.status(404).json({ message: "Parent category not found" });
    }

    /* prevent duplicate within same parent */
    const dup = await SubCategory.findOne({
      name: name.trim(),
      categoryId: categoryId,
    });
    if (dup) {
      return res
        .status(409)
        .json({ message: "Sub‑category already exists in this category" });
    }

    const newSub = await SubCategory.create({
      name: name.trim(),
      categoryId: categoryId,
    });

    res
      .status(201)
      .json({ message: "Sub‑category created", subCategory: newSub });
  } catch (err) {
    console.error("Add SubCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("categoryId");

    res.status(200).json(subCategories);
  } catch (err) {
    console.error("Get SubCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
