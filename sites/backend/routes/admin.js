import auth from "../middleware/auth.js";
import userController from '../controller/userController.js';
import categoryController from '../controller/categoryController.js';
import dashboardController from '../controller/dashboardController.js';
import templateController from "../controller/templateController.js";
import Router from "express";

const router = Router.Router();
const { adminLogin, getUser, getAllUsers, updateUser } = userController;
const { dashboardCount } = dashboardController;
const { createCategory, getCategories, getCategoryById, updateCategoryById, deleteCategoryById } = categoryController;
const { createTemplate, getAllTemplates, getTemplateById, updateTemplateById, deleteTemplateById } = templateController;

// login 
router.post("/login", adminLogin);

// profile
router.get("/me", auth, getUser);
router.put("/", auth, updateUser);

// dashboard
router.get("/dashboard/stats", auth, dashboardCount);

// users
router.get("/users", auth, getAllUsers);

// categories
router.get("/categories", getCategories);
router.post("/category", auth, createCategory);
router.get("/category/:id", auth, getCategoryById);
router.put("/category/:id", auth, updateCategoryById);
router.delete("/category/:id", auth, deleteCategoryById);

// templates
// router.get("/category/:category_id", auth, getAllTemplatesByCategoryId);
router.get("/templates/", getAllTemplates);
router.post("/", auth, createTemplate);
router.get("/template/:id", auth, getTemplateById);
router.put("/template/:id", auth, updateTemplateById);
router.delete("/template/:id", auth, deleteTemplateById);




export default router;
