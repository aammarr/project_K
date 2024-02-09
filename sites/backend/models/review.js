import db from './dbConnection.js';

export default {
    // 
    createReview: async (dataObj) => {
        const fields = Object.keys(dataObj);
        const values = fields.map((field) => `'${dataObj[field]}'`).join(',');
        const sql = `INSERT INTO reviews (${fields.join(',')}) VALUES (${values})`;
        const rows = await db.query(sql);

        return rows.insertId;
    },

    //
    countAllReviewByTemplateId:async (template_id) =>{
        const sql = `SELECT count(*) as count FROM reviews 
            WHERE template_id = '${template_id}'`; 
        const rows = await db.query(sql);
        return rows;
    },

    //
    calculateAverageRating:async (template_id) =>{
        const sql = `
            SELECT AVG(rating) AS average_rating
            FROM reviews
            WHERE template_id =  '${template_id}'`; 
        const rows = await db.query(sql);
        return rows;
    },
}