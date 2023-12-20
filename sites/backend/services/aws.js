import {
    S3,
    CreateBucketCommand,
    GetObjectCommand,
    PutObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    ListPartsCommand,
    CompleteMultipartUploadCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3 client name client
const client = new S3({
    region: 'eu-west-1',
    sslEnabled: true,
    credentials: {
        accessKeyId: 'AKIARUWRACK3VTUPUHW6',
        secretAccessKey: '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'
    }
});

export default {
    // Funciton CreateMultipartUploadCommand
    CreateMultipartUploadCommand(Params){
        const command = new CreateMultipartUploadCommand({
            Bucket: Params.Bucket,
            Key: Params.Key
        });
        return client.send(command);
    },

    // Funciton getPutSignedUrlMultipart
    getPutSignedUrlMultipart:async (params)=>{
        const command = new UploadPartCommand({
            Bucket: params.bucket,
            Key: params.key,
            PartNumber:params.partNumber,
            UploadId:params.uploadId,
        });

        // const signedUrl = client.send(command);
        const signedUrl = await getSignedUrl(client, command);
        return signedUrl;
    },

    // Funciton completeMultipartUpload
    completeMultipartUpload:async (bucketName, key, uploadId, responseListParts)=>{
        // Complete the multipart upload
        const PartsParts = responseListParts.map((item) => ({
            PartNumber: item.PartNumber,
            // ETag: item.ETag.replace(/"/g, ''), // Remove double quotes from ETag
            ETag: item.ETag ? item.ETag.replace(/"/g, '') : undefined
        }));
        
        const params = {
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: PartsParts,
            },
        };
        
        const command = new CompleteMultipartUploadCommand(params);
        return client.send(command);
    },

    // Funciton getPutSignedUrl
    getPutSignedUrl:async(bucket, key)=>{
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key
        });
        return getSignedUrl(client, command);
    }
}