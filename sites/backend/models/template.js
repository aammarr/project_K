import db from './dbConnection.js';

export default {

    // 
    getAllTemplates: async () => {
        const sql = `SELECT * FROM templates`;
        const rows = await db.query(sql);
        return rows;
    },

    // 
    createTemplate: async (dataObj) => {
        const fields = Object.keys(dataObj);
        const values = fields.map((field) => `'${dataObj[field]}'`).join(',');
        const sql = `INSERT INTO templates (${fields.join(',')}) VALUES (${values})`;
        console.log(sql);
        const rows = await db.query(sql);
        console.log(rows);

        return rows.insertId;
    },
}