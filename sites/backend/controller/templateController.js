import template from "../models/template.js";
import picture from "../models/picture.js";
import Modelreview from "../models/review.js";
import AWS from 'aws-sdk';
import moment from 'moment';
import awsService from '../services/aws.js';
import aws from "../services/aws.js";

const { config, S3 } = AWS;
AWS.config.update({
    accessKeyId: 'AKIARUWRACK3VTUPUHW6',
    secretAccessKey: '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',
    bucketName: 'project-k-templates',
    awsRegion: 'eu-west-1'
});
export default {
    
    // Function createTemplate
    createTemplate: async (req, res) => {
        try {

            const { category_id, template_code, template_name, template_description,
                template_key, template_size,template_type,template_url,template_thumbnail, template_multiple_thumbnails
            } = req.body;

            const user_id = req?.user.userId;
            const template_view_count = 0;
            const template_download_count = 0;
            if(!template_name || !template_description || !template_url || !template_thumbnail){
              return res.status(401).send({ status: false, message: 'Template name, Template Description & Template URL is required' });
            }

            let a = template_multiple_thumbnails
            let parsedArray = JSON.parse(a);
           
            let template_id = await template.createTemplate({user_id, category_id,template_code, template_name, template_description,
                template_key, template_size,template_type,template_url, template_thumbnail, 
                template_view_count, template_download_count
            });
            for (let i = 0; i < parsedArray.length; i++) {
                let obj = {
                    template_id:template_id,
                    picture_url:parsedArray[i]
                };
                await picture.createPicture(obj);
            }
    
            return res.status(200).send({ status: true, message: 'Template created successfully' });
        } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Function Get all templates
    getAllTemplates: async (req, res) => {
        try {
            const { category_id = '', page = 1, limit = 10, search = '' } = req.query;
            const tableName = 'templates';

            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            };
            const offset = (options.page - 1) * options.limit;

            // Define the search criteria using the search variable
            const searchCriteria = {
                category_id: category_id,
                template_name: search, // Use the search variable here
            };
            let condition = ``;
            if (category_id) {
                condition = condition + ' and t.category_id = '+searchCriteria.category_id;
            }

            // Get the count based on both search criteria and overall criteria
            const totalCount = await template.getAllTemplatesCount(searchCriteria,condition);
            const data = await template.getAllTemplates(searchCriteria, options, offset,condition);
           
            // Calculate next and previous page numbers based on the filtered count
            const totalPages = Math.ceil(totalCount[0].count / options.limit);
            const prevPage = options.page > 1 ? options.page - 1 : null;
            const currPage = options.page > 1 ? options.page: options.page;
            const nextPage = options.page < totalPages ? options.page + 1 : null;

            return res.status(200).send({
                status: true,
                data: data,
                pagination: {
                    totalResults: totalCount[0].count,
                    totalPages: totalPages,
                    prevPage: prevPage,
                    currPage: currPage,
                    nextPage: nextPage,
                },
                message: 'Template fetched successfully.',
            });
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Function Get all templates
    getAllTemplatesByCategoryId: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const tableName = 'templates';

            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            };
            const offset = (options.page - 1) * options.limit;
            
            // Define the search criteria
            const searchCriteria = {
                template_name: search,
                category_id: req.params.category_id
            };

            const data = await template.getAllTemplatesByCategoryId(searchCriteria, options,offset);
            // Calculate next and previous page numbers
            const totalCount = await template.getCountAllTemplatesByCategoryId(searchCriteria,options,offset);
            const totalPages = Math.ceil(totalCount[0].count / options.limit);
            const nextPage = options.page < totalPages ? options.page + 1 : null;
            const prevPage = options.page > 1 ? options.page - 1 : null;

            return res.status(200).send({
                status: true,
                data:data,
                pagination:{
                    totalResults:totalCount[0].count,
                    totalPages:totalPages,
                    nextPage:nextPage,
                    prevPage:prevPage,
                },
                message: 'Template fetched successfully.',
            });
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error', error });
        }

    },

    // Function Get template by ID
    getTemplateById: async (req, res) => {
        const templateId = req.params.id;
        try {
            const foundTemplate = await template.getTemplateById(templateId);
            if (!foundTemplate) {
                return res.status(404).send({ status: false, data:{}, message: 'Template not found' });
            }
            const multipleThumbnails = await picture.getPicturesByTemplateId(templateId);
            foundTemplate.template_multiple_thumbnails = multipleThumbnails;

            let viewCount = foundTemplate.template_view_count+1;
            await template.updateTemplateById(foundTemplate.template_id,{"template_view_count":viewCount});

            return res.status(200).send({ status: true, data: foundTemplate ,message: 'Template fetched successfully.' });
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Function Update template by ID
    updateTemplateById: async (req, res) => {
        const templateId  = req.params.id;
        const updateData = req.body;

        try {
            const foundTemplate = await template.getTemplateById(templateId);
            if (!foundTemplate) {
                return res.status(404).send({ status: false, data:foundTemplate, message: 'Template not found' });
            }
            else{
                let parsedArray=[];
                let multipleThumbnails = updateData.template_multiple_thumbnails;
                parsedArray = JSON.parse(multipleThumbnails);
                delete updateData.template_multiple_thumbnails;

                await template.updateTemplateById(templateId, updateData);
                const updatedTemplate = await template.getTemplateById(templateId);

                let pictures = await picture.getPicturesByTemplateId(templateId);

                if(pictures.length != 0){
                    await picture.deletePicturesByTemplateId(templateId);
                }
                for (let i = 0; i < parsedArray.length; i++) {
                    let obj = {
                        template_id:templateId,
                        picture_url:parsedArray[i]
                    };
                    await picture.createPicture(obj);
                }
                updatedTemplate.template_multiple_thumbnails = pictures;

                return res.status(200).send({ status: true, data:updatedTemplate ,message: 'Template updated successfully' });
            }
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Function Delete template by ID
    deleteTemplateById: async (req, res) => {
        const templateId = req.params.id;
        try {
            const foundTemplate = await template.getTemplateById(templateId);
            if (foundTemplate.length<1) {
                return res.status(404).send({ status: false, data:foundTemplate, message: 'Template not found' });
            }
            else{
                const updatedTemplate = await template.deleteTemplateById(templateId);
                return res.status(200).send({ status: true, message: 'Template deleted successfully' });
            }
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Function getUploadId
    getUploadId: async (req,res) => {
        try {
            const prefix = 'project_k_templates/'+moment().format('YYYYMMDD_HHmmss') + "_";
            // const key = prefix+req.body?.name.replace(/ /g, '_');
            const key = prefix + (req.body?.name ? req.body.name.replace(/ /g, '_') : '');

            const params ={
                Bucket: process.env.AWS_BUCKET,
                Key: key,
                StorageClass: 'STANDARD'
            }
            const CreateMultipartUploadCommandResponse = await awsService.CreateMultipartUploadCommand(params);
            if(CreateMultipartUploadCommandResponse != ''){
                return res.status(200).send({ 
                    status: true,
                    response:{
                        createMultipartUploadResponse : CreateMultipartUploadCommandResponse,
                    },
                    message: 'Upload Id fethced successfully',
                });
            }
            else{
                return res.status(500).send({ status: false, message: 'Internal server error', error });
            }
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error while getUploadId', error });
        }
    },

    // 
    getSignedUrlMultipPart:async (req,res,next)=>{
        try{
            const bucketName = process.env.AWS_BUCKET;
            const key = req.body.key;
            const uploadId = req.body.uploadId;
            const totalParts = parseInt(req.body.totalParts);
            
            let signedUrls =[];
            for (let i = 0; i < totalParts; i++) {
                let params ={
                    bucket :bucketName,
                    key : key,
                    partNumber: i+1,
                    uploadId :uploadId,
                    Expires: 60
                };

                const url = await awsService.getPutSignedUrlMultipart(params);
                signedUrls.push(url);
                
            }
        return res.json({
            data: {
                'signedUrls':signedUrls,
                'key':key,
            },
            message: 'Url fetched successfuly.'
        });
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error while getSignedUrlMultipPart', error });
        }
    },

    // Function listMultipartUpload
    listMultipartUpload:async (req,res,next)=>{
        try{ 
            const params = {
                Bucket: global.config.aws.bucket,
                Key: req.body.key,
                UploadId: req.body.uploadId,
            }
            return await lib.util.s3.listMultipartUpload(params);
        }
        catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error while listMultipartUpload', error });
        }
    },

    // Function completeMultipartUpload
    completeMultipartUpload:async (req,res,next)=>{
        try{
            const s3Params = {
                Bucket: process.env.AWS_BUCKET,
                Key: req.body?.key,
                UploadId: req.body?.uploadId,
                MultipartUpload: req.body?.ETagsArray
            }
            let response =  await awsService.completeMultipartUpload(s3Params.Bucket, s3Params.Key, s3Params.UploadId, s3Params.MultipartUpload);
            return res.json({
                status: 200,
                data: response,
                message: 'Complete MultipartUpload successfuly.'
            });
        }
        catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error while completeMultipartUpload', error });
        }
    },

    // Function fileSaveIntoDb
    fileSaveIntoDb:async(req,res,next)=>{
        try {
            const fileInfo = {
                template_key: req.body?.key,
                template_name: req.body?.name,
                template_size: req.body?.size,
                template_type: req.body?.content_type,
                template_url: req.body?.url
            };
            // save into db


            res.status(200).json({
                status: 200,
                message: 'File saved into db successfully'
            });
        }
        catch(err)
        {
            next(err);
        }
    },

    // Function getPutSignedUrl
    getPutSignedUrl: async(req,res,next) =>{
        try{
            const bucketName = process.env.AWS_BUCKET;
            const prefix = 'project_k_templates/'+moment().format('YYYYMMDD_HHmmss') + "_";
            const key = prefix + (req.query?.name ? req.query.name.replace(/ /g, '_') : '');
            const url = await awsService.getPutSignedUrl(bucketName, key);
            return res.status(200).send({ 
                data: {
                    'url':url,
                    'key':key
                },
                message: 'Signed url fetched successfully.'
            });
        }
        catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error getPutSignedUrl', error });
        }
    },

    // Function getDownloadUrl
    getDownloadUrl: async(req,res,next)=>{
        try{
            const bucketName = process.env.AWS_BUCKET;
            const key = req.query.name;
            const url = await awsService.getSignedUrlDownload(bucketName, key);
            const fetchedTemplate = await template.getTemplateByKey(key);
            
            let newCount = fetchedTemplate.template_download_count+1;
            await template.updateTemplateDownloadCount(key,{"template_download_count":newCount});

            return res.json({
                data: url,
                message: 'Download Url fetched successfuly.'
            });
        }
        catch(err){
            next(err);
        }
    },

    // Function Add Template Review By Appointment Id
    addTemplateReviewByAppointmentId: async(req,res,next)=>{
        try{
            const userId = req?.user.userId;
            const templateId = req?.params.id;
            const title = req?.body.title;
            const review = req?.body.review;
            const rating = req?.body.rating;
            
            if(!templateId || !review || !review || !rating){
              return res.status(401).send({ status: false, message: 'Template Id, Title, Review  & Rating is required' });
            }
            
            // 
            const foundTemplate = await template.getTemplateById(templateId);
            if (!foundTemplate) {
                return res.status(404).send({ status: false, data:foundTemplate, message: 'Template not found' });
            }
            else{
                let obj = {
                    user_id:userId,
                    template_id:templateId,
                    title:title,
                    review:review,
                    rating:rating
                };
                await Modelreview.createReview(obj);
                let newAverageRating = await Modelreview.calculateAverageRating(templateId);
                let updateData = {
                    review_count:foundTemplate.review_count+=1,
                    rating:newAverageRating[0].average_rating,
                };
                await template.updateTemplateById(templateId, updateData);
            }
            
            return res.status(200).send({ status: true, message: 'Template review created successfully.' });
        }
        catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error.', error });
        }
    },
    
    // Function Add Template Review By Appointment Id
    getTemplateReviewByAppointmentId: async(req,res,next)=>{
        try{
            const templateId = req?.params.id;
            if(!templateId){
                return res.status(401).send({ status: false, message: 'Template Id is required' });
            }
            
            // 
            const foundTemplate = await template.getTemplateById(templateId);
            if (!foundTemplate) {
                return res.status(404).send({ status: false, data:foundTemplate, message: 'Template not found' });
            }

            let reviews = await Modelreview.getAllReviewsByTemplateId(templateId);

            return res.status(200).send({ status: true, data:reviews, message: 'Template review fetched successfully.' });
        }
        catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error.', error });
        }
    },

    // Function testgetAllFunciton
    testgetAllFunciton:async(req,res,next)=>{
        try{
            const {page = 1, limit = 10, category_id = null} = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            };
            const offset = (options.page - 1) * options.limit;
            
            // Define the search criteria
            const searchCriteria = {
                template_name: req.query.search
            };
            const categoryCondition = category_id ? `AND t.category_id = '${category_id}'` : '';
            const data = await template.ammar(searchCriteria, categoryCondition, options, offset);
            
            // Calculate next and previous page numbers
            // const totalCount = await template.getCountAllTemplates(searchCriteria, options,offset);
            const totalPages = Math.ceil(data.count / options.limit);
            const nextPage = options.page < totalPages ? options.page + 1 : null;
            const prevPage = options.page > 1 ? options.page - 1 : null;
            
            return res.status(200).send({
                status: true,
                data:data.templates,
                pagination:{
                    totalResults:data.count,
                    totalPages:totalPages,
                    nextPage:nextPage,
                    prevPage:prevPage,
                },
                message: 'Template fetched successfully.',
            });
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
        
    }


}