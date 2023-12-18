import categroy from "../models/category.js";


export default {
    //Add Category Function
    createCategory: async (req, res) => {
        console.log("create new category")
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

    // 
    getCategories: async (req, res) => {
        console.log("get all categories");
        try {
            const categories = await categroy.getAllCategories();
            return res.status(200).send({ status: true, data: categories, message: 'Categories fetched successfully' });
        } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },
    
    // 
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

    // 
    updateCategoryById: async (req, res) => {
        try {
            const category_id= req?.params?.id;
            const category_name= req?.body?.category_name;
            if(!category_id){
                return res.status(401).send({ status: false, message: 'Category id is required' });
            }
            const category = await categroy.getCategoryById(category_id);
            if(!category){
                return res.status(404).send({ status: false, data:[], message: 'Category not found' });
            }
            else{
                await categroy.updateCategoryById(category_id,{category_name});
            }
            return res.status(200).send({ status: true, message: 'Category updated successfully' });
        } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },

    //   
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