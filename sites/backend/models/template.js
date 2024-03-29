import db from './dbConnection.js';

export default {

    // 
    getAllTemplates: async (searchCriteria,options,offset,condition) => {
        const sql = `SELECT t.*, c.category_name FROM templates as t
                    left join categories as c
                    on t.category_id = c.category_id 
                    WHERE t.template_name LIKE '%${searchCriteria.template_name}%'
                    ${condition}
                    order by t.template_id desc
                    Limit ${options.limit} offset ${offset}`;
        const rows = await db.query(sql);
        return rows;
    },
    
    //
    getAllTemplatesCount: async (searchCriteria,condition) => {
        const sql = `SELECT count(*) as count FROM templates as t
                    left join categories as c
                    on t.category_id = c.category_id 
                    WHERE t.template_name LIKE '%${searchCriteria.template_name}%'
                     ${condition}`
        const rows = await db.query(sql);
        return rows;
    },

    // 
    getCountAllTemplates: async (searchCriteria,options,offset) => {
        const sql = `SELECT count(*) as count FROM templates as t
                    left join categories as c
                    on t.category_id = c.category_id 
                    WHERE t.template_name LIKE '%${searchCriteria.template_name}%'`;
        const rows = await db.query(sql);
        return rows;
    },

    // 
    getAllTemplatesByCategoryId: async (searchCriteria,options,offset) => {
        const sql = `SELECT t.*, c.category_name FROM templates as t
                    left join categories as c
                    on t.category_id = c.category_id 
                    WHERE t.category_id = '${searchCriteria.category_id}'
                    AND t.template_name LIKE '%${searchCriteria.template_name}%'
                    order by t.template_id desc
                    Limit ${options.limit} offset ${offset}`;
        
        console.log('getAllTemplatesByCategoryId : ',sql)
        const rows = await db.query(sql);
        return rows;
    },

    //
    getCountAllTemplatesByCategoryId:async (searchCriteria,options,offset) => {
        const sql = `SELECT count(*) as count FROM templates as t
                    left join categories as c
                    on t.category_id = c.category_id 
                    WHERE t.category_id = '${searchCriteria.category_id}'
                    AND t.template_name LIKE '%${searchCriteria.template_name}%'`;
        const rows = await db.query(sql);
        return rows;
    },

    // Function createTemplate
    createTemplate: async (dataObj) => {
        const fields = Object.keys(dataObj);
        const values = fields.map((field) => `'${dataObj[field]}'`).join(',');
        const sql = `INSERT INTO templates (${fields.join(',')}) VALUES (${values})`;
        const rows = await db.query(sql);

        return rows.insertId;
    },

    // Function getTemplateById
    getTemplateById: async (template_id) =>{
        
        const sql = `SELECT t.*, c.category_name FROM templates as t
        left join categories as c
        on t.category_id = c.category_id 
        WHERE t.template_id = ${template_id}`;
        const [rows] = await db.query(sql);

        return rows;
    },

    //
    updateTemplateById: async (id,category_data) => {
        let sql = 'UPDATE templates SET';
        const fields = Object.keys(category_data);
        for (let i = 0; i < fields.length; i++) {
        sql += ` ${fields[i]} = '${category_data[fields[i]]}',`;
        }
        sql = sql.slice(0, -1); 
        sql += ` WHERE template_id = ${id}`;

        return await db.query(sql);
    },

    //
    deleteTemplateById: async (id) => {
        const sql = `
            Delete from templates 
            WHERE template_id = ?`;
        const params = [id];
        await db.query(sql, params);
        return true;
    },

    //
    tableCount: async(tableName)=>{
        const sql = `SELECT count(*) as  count FROM ${tableName}`;
        const rows = await db.query(sql);
        return rows;
    },

    //
    getTotalTemplatesDownloadCount: async()=>{
        const sql = `SELECT SUM(template_download_count) as count FROM templates`;
        const rows = await db.query(sql);
        return rows;
    },

    //
    getTemplateByKey:async (key)=>{
        const sql = `SELECT t.*, c.category_name FROM templates as t
        left join categories as c
        on t.category_id = c.category_id 
        WHERE t.template_key = '${key}'`;
        const [rows] = await db.query(sql);

        return rows;
    },

    //
    updateTemplateDownloadCount:async (key,data)=>{
        let sql = 'UPDATE templates SET';
        const fields = Object.keys(data);
        for (let i = 0; i < fields.length; i++) {
        sql += ` ${fields[i]} = '${data[fields[i]]}',`;
        }
        sql = sql.slice(0, -1); 
        sql += ` WHERE template_key = '${key}'`;

        return await db.query(sql);
    },

    //
    testgetAllFunciton: async(searchCriteria, categoryCondition, options, offset)=>{
        
        const sql = `SELECT t.*, c.category_name FROM templates as t
            LEFT JOIN categories as c
            ON t.category_id = c.category_id 
            WHERE t.template_name LIKE '%${searchCriteria.template_name}%' ${categoryCondition}
            LIMIT ${options.limit} OFFSET ${offset}`;

        const countSql = `SELECT COUNT(*) as count FROM templates as t
                    LEFT JOIN categories as c
                    ON t.category_id = c.category_id 
                    WHERE t.template_name LIKE '%${searchCriteria.template_name}%' ${categoryCondition}
                    LIMIT ${options.limit} OFFSET ${offset}`;

        const [rows, countRows] = await Promise.all([
            db.query(sql),
            db.query(countSql),
        ]);

        return {
            templates: rows,
            count: countRows[0].count,
        };

    }
}