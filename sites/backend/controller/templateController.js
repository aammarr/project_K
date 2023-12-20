import template from "../models/template.js";
import AWS from "aws-sdk";
import moment from "moment";
import awsService from "../services/aws.js";
import aws from "../services/aws.js";

const { config, S3 } = AWS;
AWS.config.update({
  accessKeyId: "AKIARUWRACK3VTUPUHW6",
  secretAccessKey: "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",
  bucketName: "project-k-templates",
  awsRegion: "eu-west-1",
});
export default {
  //
  createTemplate: async (req, res) => {
    console.log("create new template");
    try {
      const {
        category_id,
        template_code,
        template_name,
        template_description,
      } = req.body;
      const user_id = req?.user.userId;
      const template_view_count = 0;
      let template_download_count = 0;
      if (!template_name || !template_description) {
        return res
          .status(401)
          .send({
            status: false,
            message: "Template name & Template Description is required",
          });
      }

      await template.createTemplate({
        user_id,
        category_id,
        template_name,
        template_description,
        template_code,
        template_view_count,
        template_download_count,
      });

      return res
        .status(200)
        .send({ status: true, message: "Template created successfully" });
    } catch (error) {
      return res
        .status(500)
        .send({ status: false, message: "Internal server error", error });
    }
  },

  // Get all templates
  getAllTemplates: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const tableName = "templates";

      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
      const offset = (options.page - 1) * options.limit;

      // Define the search criteria
      const searchCriteria = {
        template_name: req.query.search,
      };

      const data = await template.getAllTemplates(
        searchCriteria,
        options,
        offset
      );

      // Calculate next and previous page numbers
      const totalCount = await template.getCountAllTemplates(tableName);
      const totalPages = Math.ceil(totalCount[0].count / options.limit);
      const nextPage = options.page < totalPages ? options.page + 1 : null;
      const prevPage = options.page > 1 ? options.page - 1 : null;

      return res.status(200).send({
        status: true,
        data: data,
        pagination: {
          totalResults: totalCount[0].count,
          totalPages: totalPages,
          nextPage: nextPage,
          prevPage: prevPage,
        },
        message: "Template fetched successfully.",
      });
    } catch (error) {
      return res
        .status(500)
        .send({ status: false, message: "Internal server error", error });
    }
  },

  // Get all templates
  getAllTemplatesByCategoryId: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const tableName = "templates";

      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
      const offset = (options.page - 1) * options.limit;

      // Define the search criteria
      const searchCriteria = {
        template_name: search,
        category_id: req.params.category_id,
      };

      const data = await template.getAllTemplatesByCategoryId(
        searchCriteria,
        options,
        offset
      );
      // Calculate next and previous page numbers
      const totalCount = await template.getCountAllTemplatesByCategoryId(
        searchCriteria,
        options,
        offset
      );
      const totalPages = Math.ceil(totalCount[0].count / options.limit);
      const nextPage = options.page < totalPages ? options.page + 1 : null;
      const prevPage = options.page > 1 ? options.page - 1 : null;

      return res.status(200).send({
        status: true,
        data: data,
        pagination: {
          totalResults: totalCount[0].count,
          totalPages: totalPages,
          nextPage: nextPage,
          prevPage: prevPage,
        },
        message: "Template fetched successfully.",
      });
    } catch (error) {
      return res
        .status(500)
        .send({ status: false, message: "Internal server error", error });
    }
  },

  // Get template by ID
  getTemplateById: async (req, res) => {
    const templateId = req.params.id;
    try {
      const foundTemplate = await template.getTemplateById(templateId);
      if (!foundTemplate) {
        return res
          .status(404)
          .send({ status: false, data: {}, message: "Template not found" });
      }
      return res
        .status(200)
        .send({
          status: true,
          data: foundTemplate,
          message: "Template fetched successfully.",
        });
    } catch (error) {
      return res
        .status(500)
        .send({ status: false, message: "Internal server error", error });
    }
  },

  // Update template by ID
  updateTemplateById: async (req, res) => {
    const templateId = req.params.id;
    const updateData = req.body;

    try {
      const foundTemplate = await template.getTemplateById(templateId);
      if (!foundTemplate) {
        return res
          .status(404)
          .send({
            status: false,
            data: foundTemplate,
            message: "Template not found",
          });
      } else {
        await template.updateTemplateById(templateId, updateData);
        const updatedTemplate = await template.getTemplateById(templateId);
        return res
          .status(200)
          .send({
            status: true,
            data: updatedTemplate,
            message: "Template updated successfully",
          });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ status: false, message: "Internal server error", error });
    }
  },

  // Delete template by ID
  deleteTemplateById: async (req, res) => {
    const templateId = req.params.id;
    try {
      const foundTemplate = await template.getTemplateById(templateId);
      if (foundTemplate.length < 1) {
        return res
          .status(404)
          .send({
            status: false,
            data: foundTemplate,
            message: "Template not found",
          });
      } else {
        const updatedTemplate = await template.deleteTemplateById(templateId);
        return res
          .status(200)
          .send({ status: true, message: "Template deleted successfully" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ status: false, message: "Internal server error", error });
    }
  },

  // function getUploadId
  getUploadId: async (req, res) => {
    try {
      const prefix =
        "project_k_templates/" + moment().format("YYYYMMDD_HHmmss") + "_";
      const key =
        prefix + (req.body?.name ? req.body.name.replace(/ /g, "_") : "");
      console.log(key);
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        StorageClass: "STANDARD",
      };
      const CreateMultipartUploadCommandResponse =
        await awsService.CreateMultipartUploadCommand(params);
      if (CreateMultipartUploadCommandResponse != "") {
        return res.status(200).send({
          status: true,
          response: {
            createMultipartUploadResponse: CreateMultipartUploadCommandResponse,
          },
          message: "Upload Id fethced successfully",
        });
      } else {
        return res
          .status(500)
          .send({ status: false, message: "Internal server error", error });
      }
    } catch (error) {
      console.error("Error generating upload ID:", error);
      throw error;
    }
  },

  //
  getSignedUrlMultipPart: async (req, res, next) => {
    try {
      const bucketName = process.env.AWS_BUCKET;
      const key = req.body.key;
      const uploadId = req.body.uploadId;
      const totalParts = parseInt(req.body.totalParts);

      let signedUrls = [];
      for (let i = 0; i < totalParts; i++) {
        let params = {
          bucket: bucketName,
          key: key,
          partNumber: i + 1,
          uploadId: uploadId,
          Expires: 60,
        };

        const url = await awsService.getPutSignedUrlMultipart(params);
        signedUrls.push(url);
      }
      console.log(signedUrls);
      return res.json({
        data: {
          signedUrls: signedUrls,
          key: key,
        },
        message: "Url fetched successfuly.",
      });
    } catch (err) {
      next(err);
    }
  },

  // function listMultipartUpload
  listMultipartUpload: async (req, res, next) => {
    try {
      const params = {
        Bucket: global.config.aws.bucket,
        Key: req.body.key,
        UploadId: req.body.uploadId,
      };
      return await lib.util.s3.listMultipartUpload(params);
    } catch (err) {
      next(err);
    }
  },

  // function completeMultipartUpload
  completeMultipartUpload: async (req, res, next) => {
    try {
      const s3Params = {
        Bucket: global.config.aws.bucket,
        Key: req.body.key,
        UploadId: req.body.uploadId,
        MultipartUpload: req.body.ETagsArray,
      };
      let response = await awsService.completeMultipartUpload(
        s3Params.Bucket,
        s3Params.Key,
        s3Params.UploadId,
        s3Params.MultipartUpload
      );
      return res.json({
        status: 200,
        data: response,
        message: "Complete MultipartUpload successfuly.",
      });
    } catch (err) {
      next(err);
    }
  },

  // fileSaveIntoDb
  fileSaveIntoDb: async (req, res, next) => {
    try {
      const fileInfo = {
        document_id: lib.util.guid.generate(),
        document_key: req.body?.key,
        document_name: req.body?.name,
        document_size: req.body?.size,
        document_type: req.body?.content_type,
        document_url: req.body?.url,
        document: req.body?.url,
        patient_id: req.body?.patient_id,
        intake_id: req.body?.intake_id,
        appointment_id: req.body?.appointment_id,
        aba_screening_id: req.body?.aba_screening_id,
        flag: req.body?.flag,
      };
      // // save into db
      lib.orm.documents.save(fileInfo);

      res.status(200).json({
        status: 200,
        message: "File saved into db successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  //
  getSignedUrl: async (req, res, next) => {
    try {
      const prefix = "project_k_templates/";
      const bucketName = process.env.AWS_BUCKET;
      const key =
        prefix +
        moment().format("YYYYMMDD_HHmmss") +
        "_" +
        req.query.name.replace(/ /g, "_");
      const url = await awsService.getPutSignedUrl(bucketName, key);
      return res.status(200).send({
        data: {
          url: url,
          key: key,
        },
        message: "Signed url fetched successfully.",
      });
    } catch (err) {
      next(err);
    }
  },

  //
  testgetAllFunciton: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, category_id = null } = req.query;
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
      const offset = (options.page - 1) * options.limit;

      // Define the search criteria
      const searchCriteria = {
        template_name: req.query.search,
      };
      const categoryCondition = category_id
        ? `AND t.category_id = '${category_id}'`
        : "";
      console.log("------1", offset, page, limit);
      const data = await template.ammar(
        searchCriteria,
        categoryCondition,
        options,
        offset
      );

      // Calculate next and previous page numbers
      // const totalCount = await template.getCountAllTemplates(searchCriteria, options,offset);
      const totalPages = Math.ceil(data.count / options.limit);
      const nextPage = options.page < totalPages ? options.page + 1 : null;
      const prevPage = options.page > 1 ? options.page - 1 : null;

      return res.status(200).send({
        status: true,
        data: data.templates,
        pagination: {
          totalResults: data.count,
          totalPages: totalPages,
          nextPage: nextPage,
          prevPage: prevPage,
        },
        message: "Template fetched successfully.",
      });
    } catch (error) {
      return res
        .status(500)
        .send({ status: false, message: "Internal server error", error });
    }
  },
};
