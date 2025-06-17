import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  ram: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  price: Number,
  stock: Number,
  images: [String],
  variants: [VariantSchema],
   
},  { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
