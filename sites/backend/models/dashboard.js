import db from './dbConnection.js';

export default {
    //
    tableCount: async(tableName)=>{
        const sql = `SELECT count(*) as  count FROM ${tableName}`;
        const rows = await db.query(sql);
        return rows;
    }
}