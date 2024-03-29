import auth from "../middleware/auth.js";
import templateController from "../controller/templateController.js";
import Router from "express";
import AWS from "aws-sdk";

import multer from "multer";
import multerS3, { AUTO_CONTENT_TYPE } from "multer-s3";

// import uploadHelper from "../helper/upload.js";
// const { upload } = uploadHelper;
const router = Router.Router();
const {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplateById,
  deleteTemplateById,
  getAllTemplatesByCategoryId,
  getUploadId,
  getSignedUrlMultipPart,
  fileSaveIntoDb,
  completeMultipartUpload,
  getPutSignedUrl,
  getDownloadUrl,
  addTemplateReviewByAppointmentId,
  getTemplateReviewByAppointmentId
} = templateController;

router.get("/getPutSignedUrl", getPutSignedUrl);

router.post("/initiateUpload", getUploadId);
router.post("/getSignedUrlMultipart", getSignedUrlMultipPart);
router.post("/complete-multipart-upload", completeMultipartUpload);
router.post("/file-save-into-db", fileSaveIntoDb);

router.get("/getSignedUrlDownload", getDownloadUrl);

router.get("/", getAllTemplates);
router.get("/category/:category_id",  getAllTemplatesByCategoryId);
router.post("/", auth, createTemplate);
router.get("/:id", getTemplateById);
router.put("/:id", auth, updateTemplateById);
router.delete("/:id", auth, deleteTemplateById);

router.get("/review/:id", getTemplateReviewByAppointmentId);
router.post("/review/:id", auth, addTemplateReviewByAppointmentId);

// upload

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketURL: process.env.AWS_BUCKET,
});

// Create an S3 instance
const s3 = new AWS.S3();

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/media", upload.single("file"), async (req, res) => {
  const bucketName = "project-k-templates";
  const fileName = Date.now().toString() + "_" + req.file.originalname;
  const fileContent = req.file.buffer;

  // Set the parameters for S3 upload with public-read ACL
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
  };
  // Upload the file to S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading file to S3:", err);
      res.status(500).send("Error uploading file to S3");
    } else {
      const publicUrl = data.Location;
      return res.send({ public_url: publicUrl }).status(200);
    }
  });
});

export default router;
