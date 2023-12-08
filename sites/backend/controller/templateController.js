import template from "../models/template.js";

export default {
    
    // 
    createTemplate: async (req, res) => {
        console.log("create new template")
        try {
            const { template_name, template_description } = req.body;
            const user_id = req?.user.userId;

            if(!template_name || !template_description){
              return res.status(401).send({ status: false, message: 'Template name & Template Description is required' });
            }
            
            await template.createTemplate({user_id, template_name, template_description});
    
            return res.status(200).send({ status: true, message: 'Template created successfully' });
        } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    },
}