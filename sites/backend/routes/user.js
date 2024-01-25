
import auth from "../middleware/auth.js";
import userController from '../controller/userController.js';
import categoryController from '../controller/categoryController.js';
import Router from "express";


const router = Router.Router();
const { login, register, getUser, getAllUsers, updateUser, updatePassword } = userController;

router.post("/register/:type", register);
router.post("/login", login);
router.get("/me", auth, getUser);
router.put("/", auth, updateUser);
router.get("/", auth, getAllUsers);
router.post("/update-password", auth, updatePassword);

export default router;
