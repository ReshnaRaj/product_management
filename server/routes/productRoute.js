import express from "express"
import { addProduct,addToWishlist,getSingleProduct,getProducts, getWishlist, removeFromWishlist, updateProduct } from "../controller/productController.js";
import { uploadProductImages } from "../middleware/multer.js";
import verifyToken from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add-product",uploadProductImages,verifyToken,addProduct)
router.get("/get-products",verifyToken,getProducts)
router.get("/get-product/:id",verifyToken,getSingleProduct);  
router.put("/update-product/:id",verifyToken,uploadProductImages,updateProduct); 
router.get("/get-wishList",verifyToken,getWishlist);
router.post("/add-wishList",verifyToken,addToWishlist);
router.post("/remove-wishList",verifyToken,removeFromWishlist);

export default router;