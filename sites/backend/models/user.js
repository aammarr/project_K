import db from './dbConnection.js';

export default {
  create: async (profileObj) => {
    const fields = Object.keys(profileObj);
    const values = fields.map((field) => `'${profileObj[field]}'`).join(',');
    const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${values})`;
    console.log(sql)
    const rows = await db.query(sql);
    console.log(rows)
    return rows.insertId;
  },
  findByEmail: async (email) => {
    const sql = `
      SELECT * FROM users
      WHERE email = ?
    `;
    const params = [email];
    const [rows] = await db.query(sql, params);
    return rows;
  },
  updateById: async (id, userData) => {
    let sql = 'UPDATE users SET';
    const fields = Object.keys(userData);
    for (let i = 0; i < fields.length; i++) {
      sql += ` ${fields[i]} = '${userData[fields[i]]}',`;
    }
    sql = sql.slice(0, -1); 
    sql += ` WHERE id = ${id}`;
    return await db.query(sql);
  },

  findById: async (id) => {
    const sql = `
      SELECT * FROM users
      WHERE id = ?
    `;
    const params = [id];
    const [rows] = await db.query(sql, params);
    return rows;
  },
};
