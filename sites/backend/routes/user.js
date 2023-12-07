
import auth from "../middleware/auth.js";
import userController from '../controller/userController.js';
import Router from "express";
const router = Router.Router();
const { login, register, getUser, updateUser } = userController;
router.post("/register/:type", register);
router.post("/login", login);
router.get("/me", auth, getUser);
router.put("/", auth, updateUser);
router.get("/", auth, getUser);

export default router;
