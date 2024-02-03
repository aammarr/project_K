
import Router from "express";
const router = Router.Router();
router.get("/", (req, res) => {
    res.send({
        message: 'Welcome to Slidebloom.',
        version: '2024.02.03'
    });
});

export default router;
