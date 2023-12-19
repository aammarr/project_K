import categroy from "../models/category.js";
import template from "../models/template.js";


export default {
    //Add Category Function
    createCategory: async (req, res) => {
        try {
            const { category_name,category_description,category_code } = req.body;
            const user_id = req?.user.userId;

            if(!category_name){
              return res.status(401).send({ status: false, message: 'Category name is required' });
            }
            
            await categroy.createCategory({user_id, category_name,category_description,category_code});
    
            return res.status(200).send({ status: true, message: 'Category created successfully' });
        } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Get All Category Function
    getCategories: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const tableName = 'categories';
            
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            };

            
            const offset = (options.page - 1) * options.limit;

            const searchCriteria = {
                category_name: req.query.search
            };
            const data = await categroy.getAllCategories(searchCriteria, options,offset);

            // Calculate next and previous page numbers
            const totalCount = await template.tableCount(tableName);
            const totalPages = Math.ceil(totalCount[0].count / options.limit);
            const nextPage = options.page < totalPages ? options.page + 1 : null;
            const prevPage = options.page > 1 ? options.page - 1 : null;
        

            // const categories = await categroy.getAllCategories();
            // return res.status(200).send({ status: true, data: categories, message: 'Categories fetched successfully' });
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
    
    // Get Category By Id Function
    getCategoryById: async (req, res) => {
        console.log("get categories by id");
        try {
            const category_id= req?.params?.id;
            if(!category_id){
                return res.status(401).send({ status: false, message: 'Category id is required' });
            }
            const category = await categroy.getCategoryById(category_id);
            if(!category){
                return res.status(404).send({ status: false, data:[], message: 'Category not found' });
            }
            return res.status(200).send({ status: true, data: category, message: 'Category by id fetched successfully' });
        } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Update Category By Id Function
    updateCategoryById: async (req, res) => {
        try {
            const category_id= req?.params?.id;
            const category_name= req?.body?.category_name;
            const category_description= req?.body?.category_description;
            const category_code= req?.body?.category_code;

            if(!category_id){
                return res.status(401).send({ status: false, message: 'Category id is required' });
            }
            const category = await categroy.getCategoryById(category_id);
            if(!category){
                return res.status(404).send({ status: false, data:[], message: 'Category not found' });
            }
            else{
                await categroy.updateCategoryById(category_id,{category_name,category_description,category_code});
                const category = await categroy.getCategoryById(category_id);
                return res.status(200).send({ status: true, data:category, message: 'Category updated successfully' });
            }
            
        } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    // Delete Category By Id Function
    deleteCategoryById: async (req, res) => {
        console.log("delete category by id");
        try {
            const category_id= req?.params?.id;
            if(!category_id){
                return res.status(401).send({ status: false, message: 'Category id is required' });
            }
            const category = await categroy.getCategoryById(category_id);
            if(!category){
                return res.status(404).send({ status: false, data:[], message: 'Category not found' });
            }
            else{
                await categroy.deleteCategoryById(category_id);
            }

            return res.status(200).send({ status: true, message: 'Category deleted successfully' });
        } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

}