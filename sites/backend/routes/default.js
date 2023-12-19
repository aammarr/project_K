
import Router from "express";
const router = Router.Router();
router.get("/", (req, res) => {
    res.send({
        message: 'Welcome to Project K',
        version: '2023.12.20'
    });
});

export default router;
