import auth from "../middleware/auth.js";
import categoryController from "../controller/categoryController.js";
import Router from "express";

const router = Router.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = categoryController;

router.get("/", getCategories);
router.post("/", auth, createCategory);
router.get("/:id", auth, getCategoryById);
router.put("/:id", auth, updateCategoryById);
router.delete("/:id", auth, deleteCategoryById);

export default router;
