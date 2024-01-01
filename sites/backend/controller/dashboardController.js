import template from "../models/template.js";

export default {
    // 
    dashboardCount: async (req, res) => {
        try{

            const usersTable = 'users';
            const categoriesTable = 'categories';
            const templatesTable = 'templates';
            
            const usersCount = await template.tableCount(usersTable);
            const categoriesCount = await template.tableCount(categoriesTable);
            const templatesCount = await template.tableCount(templatesTable);
            const totalTemplatesDownloadCount = await template.getTotalTemplatesDownloadCount(templatesTable);

            let response = {};
            response.users=usersCount[0].count;
            response.categories=categoriesCount[0].count;
            response.templates=templatesCount[0].count;
            response.totalTemplatesDownloadCount=parseInt(totalTemplatesDownloadCount[0].count,10);
            
            console.log(response);

            return res.status(200).send({ 
                status: true,
                data:response,
                message: 'Dashboard Stats fetched successfully' 
            });
        }
        catch (error) {
            return res.status(500).send({ status: false, message: 'Internal server error', error });
        }
    }
}