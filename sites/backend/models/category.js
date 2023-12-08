import db from './dbConnection.js';

export default {
    // 
    getAllCategories: async () => {
        const sql = `SELECT * FROM categories`;
        const rows = await db.query(sql);
        return rows;
    },
    
    // 
    createCategory: async (dataObj) => {
        const fields = Object.keys(dataObj);
        const values = fields.map((field) => `'${dataObj[field]}'`).join(',');
        const sql = `INSERT INTO categories (${fields.join(',')}) VALUES (${values})`;
        console.log(sql);
        const rows = await db.query(sql);
        console.log(rows);

        return rows.insertId;
    },

    // 
    getCategoryById: async (id) => {
        const sql = `
            SELECT c.*, CONCAT(u.first_name, ' ', u.last_name) AS user_name FROM categories as c
            left join users as u
            on u.user_id = c.user_id
            WHERE category_id = ?`;
        const params = [id];
        const [rows] = await db.query(sql, params);
        return rows;
    },

    // 
    updateCategoryById: async (id,category_data) => {
        let sql = 'UPDATE categories SET';
            const fields = Object.keys(category_data);
            for (let i = 0; i < fields.length; i++) {
            sql += ` ${fields[i]} = '${category_data[fields[i]]}',`;
            }
            sql = sql.slice(0, -1); 
            sql += ` WHERE category_id = ${id}`;

            return await db.query(sql);
    },
        
    // 
    deleteCategoryById: async (id) => {
        const sql = `
            Delete from categories 
            WHERE category_id = ?`;
        const params = [id];
        await db.query(sql, params);
        return true;
    },

};