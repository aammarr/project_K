import db from './dbConnection.js';

export default {
    // Function to add new Pictures
    createPicture: async (dataObj) => {
        const fields = Object.keys(dataObj);
        const values = fields.map((field) => `'${dataObj[field]}'`).join(',');
        const sql = `INSERT INTO pictures (${fields.join(',')}) VALUES (${values})`;
        const rows = await db.query(sql);

        return rows.insertId;
    },

    // Function getTemplateById
    getPicturesByTemplateId: async (template_id) =>{
        
        const sql = `SELECT p.picture_url FROM pictures as p 
        WHERE p.template_id =  ${template_id}`;
        const rows = await db.query(sql);
        return rows;
    },
}