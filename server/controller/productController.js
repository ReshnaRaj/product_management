import Product from '../models/ProductSchema.js';
import Category from '../models/CategorySchema.js';
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
    const products = await Product.find()
      .populate("subCategoryId", "name")
      .select("-__v -createdAt -updatedAt");
    
    res.status(200).json(products);
  } catch (err) {
    console.error("Get Products error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
