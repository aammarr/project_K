import template from "../models/template.js";

export default {
    
    // 
    createTemplate: async (req, res) => {
        console.log("create new template")
        try {
            const { template_code, template_name, template_description, template_type, template_size, template_key,
                template_url, template_thumbnail, template_view_count, template_download_count, template_flag  } = req.body;
            const user_id = req?.user.userId;

            if(!template_name || !template_description){
              return res.status(401).send({ status: false, message: 'Template name & Template Description is required' });
            }
            
            await template.createTemplate({user_id, template_name, template_description,template_type, template_view_count, template_download_count});
    
            return res.status(200).send({ status: true, message: 'Template created successfully' });
        } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Get all templates
    getAllTemplates: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const tableName = 'templates';
            // Define the options for pagination
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            };
            const offset = (options.page - 1) * options.limit;
            
            // Define the search criteria
            const searchCriteria = {
                // template_name: { $regex: new RegExp(search, 'i') }, // Case-insensitive search by name
                template_name: req.query.search
            };
            const data = await template.getAllTemplates(searchCriteria, options,offset);
            
            // Calculate next and previous page numbers
            const totalCount = await template.tableCount(tableName);
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

    // Get template by ID
    getTemplateById: async (req, res) => {
        const templateId = req.params.id;
        try {
            const foundTemplate = await template.getTemplateById(templateId);
            if (foundTemplate.length<1) {
                return res.status(404).send({ status: false, data:foundTemplate, message: 'Template not found' });
            }
            return res.status(200).send({ status: true, template: foundTemplate,message: 'Template fetched successfully.' });
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Update template by ID
    updateTemplateById: async (req, res) => {
        const templateId  = req.params.id;
        const updateData = req.body;

        try {
            const foundTemplate = await template.getTemplateById(templateId);
            if (foundTemplate.length<1) {
                return res.status(404).send({ status: false, data:foundTemplate, message: 'Template not found' });
            }
            else{
                const updatedTemplate = await template.updateTemplateById(templateId, updateData);
                return res.status(200).send({ status: true, message: 'Template updated successfully', updatedTemplate });
            }
        } catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Delete template by ID
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
}