import db from './dbConnection.js';

export default {
    // getAllReviewsByTemplateId
    getAllReviewsByTemplateId:async(template_id)=>{
        const sql = `SELECT r.*, u.first_name, u.last_name FROM reviews as r
            left join users as u 
            on u.user_id = r.user_id
            WHERE r.template_id =  '${template_id}'`; 
        const rows = await db.query(sql);
        return rows;
    },

    // createReview
    createReview: async (dataObj) => {
        const fields = Object.keys(dataObj);
        const values = fields.map((field) => `'${dataObj[field]}'`).join(',');
        const sql = `INSERT INTO reviews (${fields.join(',')}) VALUES (${values})`;
        const rows = await db.query(sql);

        return rows.insertId;
    },

    // countAllReviewByTemplateId
    countAllReviewByTemplateId:async (template_id) =>{
        const sql = `SELECT count(*) as count FROM reviews 
            WHERE template_id = '${template_id}'`; 
        const rows = await db.query(sql);
        return rows;
    },

    // calculateAverageRating
    calculateAverageRating:async (template_id) =>{
        const sql = `
            SELECT AVG(rating) AS average_rating
            FROM reviews
            WHERE template_id =  '${template_id}'`; 
        const rows = await db.query(sql);
        return rows;
    },
}