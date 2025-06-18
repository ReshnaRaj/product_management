import express  from "express"
import { addCategory, addSubCategory, getCategory, getSubCategory } from "../controller/categoryController.js";
import verifyToken from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add-category",verifyToken, addCategory);
router.get("/get-category",verifyToken,getCategory);
router.post("/sub-category",verifyToken, addSubCategory);
router.get("/get-sub-category",verifyToken, getSubCategory);
export default router;
