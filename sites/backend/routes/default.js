
import Router from "express";
const router = Router.Router();
router.get("/", (req, res) => {
    res.send({
        message: 'Welcome to Slidebloom.',
        version: '2024.01.25'
    });
});

export default router;
