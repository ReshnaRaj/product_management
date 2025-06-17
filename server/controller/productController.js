import Product from '../models/ProductSchema.js';
import Category from '../models/CategorySchema.js';
import Wishlist from "../models/WishlistSchema.js";
import SubCategory from '../models/SubCategorySchema.js';
/* ----------  POST /api/product  ---------- */
export const addProduct = async (req, res) => {
  try {
    const { name, description,variants,subCategoryId } = req.body;
    console.log("Request Body:", req.body); // Debugging line to check request body
    const images = req.files; 
     console.log(images,"imagess")                       // <— multer array

    if (
      !name?.trim() ||
      !description?.trim() ||
     
      
      !subCategoryId ||
      images.length === 0
    ) {
      return res.status(400).json({ message: "All fields and images are required" });
    }

 

    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) return res.status(404).json({ message: "Sub‑category not found" });

     let variantsParsed = [];
    try {
      variantsParsed = JSON.parse(variants);   // [{ ram:"2", price:"444", qty:"5" }]
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
       variants: variantsParsed, // parse variants from string
      
      subCategoryId,
      images: imageUrls,          // <-- store array in schema
    });

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("Add Product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
export const getProducts = async (req, res) => {
  try {
    /* ---------- 1. pagination ---------- */
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);
    const skip  = (page - 1) * limit;

    /* ---------- 2. fetch + populate ---------- */
    const products = await Product.find({})
      .populate("subCategoryId", "name")   // remove if you don’t need the name
      .sort({ createdAt: -1 })             // newest first
      .skip(skip)
      .limit(limit)
      .lean();                             // plain JS objects

    const total = await Product.countDocuments({});

    /* ---------- 3. massage each product ---------- */
    const urlPrefix = `${req.protocol}://${req.get("host")}`;

    const formatted = products.map((p) => {
      // absolute URLs for every image
      const images = p.images.map((img) =>
        img.startsWith("http") ? img : `${urlPrefix}${img}`
      );

      // cheapest variant price
      const cheapest = Math.min(...p.variants.map((v) => v.price));

      return {
        ...p,
        images,
        cheapestPrice: cheapest,
      };
    });

    /* ---------- 4. response ---------- */
    res.status(200).json({
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


