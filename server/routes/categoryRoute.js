import express  from "express"
import { addCategory, addSubCategory, getCategory, getSubCategory } from "../controller/categoryController.js";
const router = express.Router();

router.post("/add-category", addCategory);
router.get("/get-category",getCategory);
router.post("/sub-category", addSubCategory);
router.get("/get-sub-category", getSubCategory);
export default router;
