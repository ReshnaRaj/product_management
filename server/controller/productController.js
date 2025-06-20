import Product from "../models/ProductSchema.js";

import Wishlist from "../models/WishlistSchema.js";
import SubCategory from "../models/SubCategorySchema.js";
/* ----------  POST /api/product  ---------- */
export const addProduct = async (req, res) => {
  try {
    const { name, description, variants, subCategoryId } = req.body;
    console.log(req.body,"request")

    const images = req.files;

    if (
      !name?.trim() ||
      !description?.trim() ||
      !subCategoryId ||
      images.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "All fields and images are required" });
    }

    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory)
      return res.status(404).json({ message: "Sub‑category not found" });

    let variantsParsed = [];
    try {
      variantsParsed = JSON.parse(variants); // [{ ram:"2", price:"444", qty:"5" }]
    } catch (err) {
      return res.status(400).json({ message: "Invalid variants format" });
    }

    if (variantsParsed.length === 0) {
      return res.status(400).json({ message: "At least one variant required" });
    }

    // cast string numbers => Number, rename qty => quantity
    variantsParsed = variantsParsed.map((v) => ({
      ram: v.ram,
      price: Number(v.price),
      quantity: Number(v.qty ?? v.quantity),
    }));

    // build image URL list (or just filenames)
    const imageUrls = images.map((f) => `/productimages/${f.filename}`);

    // create product
    const newProduct = await Product.create({
      title: name.trim(),
      description: description.trim(),
      variants: variantsParsed,
      subCategoryId,
      images: imageUrls,
    });

    // Format the response with full URLs
    const host = `${req.protocol}://${req.get('host')}`;
    const formattedProduct = {
      ...newProduct.toObject(),
      images: newProduct.images.map(img => 
        img.startsWith('http') ? img : `${host}${img}`
      )
    };

    res.status(201).json({ 
      message: "Product created", 
      product: formattedProduct 
    });
  } catch (err) {
    console.error("Add Product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);
    const search = req.query.search?.trim();
    const subCategory = req.query.subCategoryId;

    const filter = {};
    if (search) {
      // case‑insensitive partial match on 'title'
      filter.title = { $regex: search, $options: "i" };
    }
    if (subCategory) {
      filter.subCategoryId = subCategory;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("subCategoryId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const host = `${req.protocol}://${req.get("host")}`;
    const formatted = products.map((p) => ({
      ...p,
      images: p.images.map((img) =>
        img.startsWith("http") ? img : `${host}${img}`
      ),
      cheapestPrice: Math.min(...p.variants.map((v) => v.price)),
    }));

    res.json({
      page,
      pages: Math.ceil(total / limit),
      total,
      products: formatted,
    });
  } catch (err) {
    console.error("Get Products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("subCategoryId", "name")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const host = `${req.protocol}://${req.get("host")}`;

    // Format image URLs
    product.images = product.images.map((img) =>
      img.startsWith("http") ? img : `${host}${img}`
    );

    res.json(product);
  } catch (err) {
    console.error("Get Single Product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, variants, subCategoryId, removedImages } = req.body;
    const images = req.files;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate required fields
    // if (!name?.trim() || !description?.trim() || !subCategoryId) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    // Validate subcategory
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }

    // Parse and validate variants
    let variantsParsed;
    try {
      variantsParsed = JSON.parse(variants);
      if (!Array.isArray(variantsParsed) || variantsParsed.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one variant required" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid variants format" });
    }

    // Process variants
    const processedVariants = variantsParsed.map((v) => ({
      ram: v.ram,
      price: Number(v.price),
      quantity: Number(v.qty || v.quantity),
    }));

    // Handle images
    let updatedImages = [...product.images];
    if (images?.length > 0) {
      const newImageUrls = images.map((f) => `/productimages/${f.filename}`);
      updatedImages = [...updatedImages, ...newImageUrls];
    }

    // Remove images if requested
    let toRemove = [];
    if (removedImages) {
      try {
        toRemove = Array.isArray(removedImages)
          ? removedImages
          : JSON.parse(removedImages);
      } catch {
        toRemove = [];
      }
      updatedImages = updatedImages.filter(
        (img) => !toRemove.includes(img)
      );
    }

    // Update product
    product.title = name.trim();
    product.description = description.trim();
    product.subCategoryId = subCategoryId;
    product.variants = processedVariants;
    product.images = updatedImages;

    await product.save();

    // Return updated product with full URLs
    const host = `${req.protocol}://${req.get("host")}`;
    const formattedProduct = {
      ...product.toObject(),
      images: product.images.map((img) =>
        img.startsWith("http") ? img : `${host}${img}`
      ),
    };

    res.json({
      message: "Product updated successfully",
      product: formattedProduct,
    });
  } catch (err) {
    console.error("Update Product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------- GET /api/wishlist -------- */
export const getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wl = await Wishlist.findOne({ user: userId })
      .populate("products", "title images variants") // select what you need
      .lean();

    res.json(wl?.products || []);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* -------- POST /api/wishlist/add -------- */
export const addToWishlist = async (req, res) => {
  const userId = req.user.id;

  const { productId } = req.body;

  try {
    const wl = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { products: productId } },
      { new: true, upsert: true }
    );

    res.status(200).json({ wishlist: wl.products });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* -------- POST /api/wishlist/remove -------- */
export const removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const wl = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true }
    );

    res.status(200).json({ wishlist: wl.products });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
