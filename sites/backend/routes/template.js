import auth from "../middleware/auth.js";
import templateController from '../controller/templateController.js';
import Router from "express";

const router = Router.Router();
const { createTemplate, getAllTemplates, getTemplateById, updateTemplateById, deleteTemplateById, getAllTemplatesByCategoryId,
    getUploadId, getSignedUrlMultipPart, fileSaveIntoDb, completeMultipartUpload, getPutSignedUrl,getDownloadUrl } = templateController;


router.get('/getPutSignedUrl', getPutSignedUrl);

router.post('/initiateUpload', getUploadId);
router.post('/getSignedUrlMultipart', getSignedUrlMultipPart);
router.post('/complete-multipart-upload', completeMultipartUpload);
router.post('/file-save-into-db', fileSaveIntoDb);

router.get('/getSignedUrlDownload', getDownloadUrl);

router.get("/", auth, getAllTemplates);
router.get("/category/:category_id", auth, getAllTemplatesByCategoryId);
router.post("/", auth, createTemplate);
router.get("/:id", auth, getTemplateById);
router.put("/:id", auth, updateTemplateById);
router.delete("/:id", auth, deleteTemplateById);




export default router;
