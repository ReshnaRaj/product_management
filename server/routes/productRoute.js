import express from "express"
import { addProduct,getProducts } from "../controller/productController.js";
import { uploadProductImages } from "../middleware/multer.js";
const router = express.Router();

router.post("/add-product",uploadProductImages,addProduct)
router.get("/get-products",getProducts)

export default router;