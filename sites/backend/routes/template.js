import auth from "../middleware/auth.js";
import templateController from '../controller/templateController.js';
import Router from "express";

const router = Router.Router();
const { createTemplate, getTemplates, getTemplateById, updateTemplateById, deleteTemplateById } = templateController;

// router.get("/", auth, getTemplates);
router.post("/", auth, createTemplate);
// router.get("/:id", auth, getTemplateById);
// router.put("/:id", auth, updateTemplateById);
// router.delete("/:id", auth, deleteTemplateById);

export default router;
