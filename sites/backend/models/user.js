import db from './dbConnection.js';

export default {
	// 
	create: async (profileObj) => {
		const fields = Object.keys(profileObj);
		const values = fields.map((field) => `'${profileObj[field]}'`).join(',');
		const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${values})`;
		console.log(sql)
		const rows = await db.query(sql);
		console.log(rows)
		return rows.insertId;
	},

	// 
	findByEmail: async (email) => {
		const sql = `
		SELECT * FROM users
		WHERE email = ?
		`;
		const params = [email];
		const [rows] = await db.query(sql, params);
		return rows;
	},
	
	// 
	updateById: async (id, userData) => {
		let sql = 'UPDATE users SET';
		const fields = Object.keys(userData);
		for (let i = 0; i < fields.length; i++) {
		sql += ` ${fields[i]} = '${userData[fields[i]]}',`;
		}
		sql = sql.slice(0, -1); 
		sql += ` WHERE user_id = ${id}`;
		return await db.query(sql);
	},

	// 
	findById: async (id) => {
		const sql = `
		SELECT * FROM users
		WHERE user_id = ?
		`;
		const params = [id];
		const [rows] = await db.query(sql, params);
		return rows;
	},

	//
	findAllUsers:async (userCondition, options, offset)=>{
		const sql = `SELECT u.* FROM users as u
		WHERE u.role_id != 1 ${userCondition}
		Limit ${options.limit} offset ${offset}`;
		
		console.log(sql);
		const rows = await db.query(sql);
		return rows;
	},

	//
	allUsersCount:async(userCondition, options, offset)=>{
		const sql = `SELECT count(*) as count FROM users as u
		WHERE u.role_id != 1 ${userCondition}`;
		
		const rows = await db.query(sql);
		return rows;
	}
};
