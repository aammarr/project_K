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
    
    // Function to update Pictures
    updatePicture: async (id, pictureData) => {
        let sql = 'UPDATE pictures SET';
        const fields = Object.keys(pictureData);
        for (let i = 0; i < fields.length; i++) {
        sql += ` ${fields[i]} = '${pictureData[fields[i]]}',`;
        }
        sql = sql.slice(0, -1); 
        sql += ` WHERE template_id = ${id}`;

        return await db.query(sql);
    },

    // Function getTemplateById
    getPicturesByTemplateId: async (template_id) =>{
        
        const sql = `SELECT p.picture_id, p.picture_url FROM pictures as p 
        WHERE p.template_id =  ${template_id}`;
        const rows = await db.query(sql);
        return rows;
    },
    
    // Function getTemplateById
    deletePicturesByTemplateId: async (template_id) =>{
        
        const sql = `delete from pictures where template_id =  ${template_id}`;
        const rows = await db.query(sql);
        return rows;
    },
}