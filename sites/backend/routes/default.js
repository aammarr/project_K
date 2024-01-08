
import Router from "express";
const router = Router.Router();
router.get("/", (req, res) => {
    res.send({
        message: 'Welcome to Project K',
        version: '2024.01.09'
    });
});

export default router;
