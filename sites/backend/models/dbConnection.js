import pool from "../startup/db.js";

export default {
  query: async (sql, params) => {
    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(sql, params);
      return rows;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },
};