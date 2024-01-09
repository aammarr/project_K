import aws from 'aws-sdk';
const { config, S3 } = aws;
import multer from 'multer';
import multerS3, { AUTO_CONTENT_TYPE } from 'multer-s3';
import dotenv from 'dotenv';

dotenv.config();

config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketURL: process.env.AWS_BUCKET
});

var s3 = new S3({});

var upload = multer(console.log('-hello-'),{
    storage: multerS3({
        acl: "public-read",
        s3: s3,
        contentType: AUTO_CONTENT_TYPE,
        bucket: process.env.AWS_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            console.log('-hello-2')
            let path = "";
            let fileName =
                Math.random()
                    .toString()
                    .split(".")[1] +
                Date.now() +
                file.originalname.substr(file.originalname.length - 30 >= 0 ? file.originalname.length - 30 : 0);
            fileName = fileName.replace(/\s/g, "").replace(/[^\w-.]+/g, "");
            path = `${fileName}`;
            cb(null, path)
        }
    })
})
export default { upload };
