import auth from "../middleware/auth.js";
import dashboardController from '../controller/dashboardController.js';
import Router from "express";

const router = Router.Router();
const { dashboardCount } = dashboardController;

router.get("/stats", auth, dashboardCount);

export default router;
