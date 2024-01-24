import user from "../models/user.js";
import Util from "../helper/util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import template from "../models/template.js";

export default {
	//
	register: async (req, res) => {
		try {
		// const { type } = req?.params =='user' ?2:'';

		if (req?.params?.type === "user") req.body.role_id = 2;

		const { email, password, ...profileData } = req.body;

		const userRecord = await user.findByEmail(email);
		if (userRecord) {
			return res
			.status(401)
			.send({ status: false, message: "Email already exist" });
		}
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		// const account_type = type || 'user';
		await user.create({ email, password: hashedPassword, ...profileData });

		return res
			.status(200)
			.send({ status: true, message: "User created successfully" });
		} catch (error) {
		return res
			.status(500)
			.send({ status: false, message: "Internal server error", error });
		}
	},

	//
	login: async (req, res) => {
		console.log("login");
		try {
			const { email, password } = req.body;
			const userRecord = await user.findByEmail(email);
			if (!userRecord) {
				res
				.status(401)
				.send({ status: false, message: "Authentication failed" });
				return;
			}
			const passwordMatch = await bcrypt.compare(password, userRecord.password);
			if (!passwordMatch) {
				res
				.status(401)
				.send({ status: false, message: "Authentication failed" });
				return;
			}
			delete userRecord.password;
			delete userRecord.otp;

			const role = userRecord.role_id == 1 ? "admin" : "user";
			let tokenObj = {
				userId: userRecord.user_id,
				role: role,
			};

			if(role == 'user'){
				const token = jwt.sign(tokenObj, Util("JWT_KEY", "unsecureKey"));
				return res.status(200).send({ 
					status: true,
					data: { ...userRecord, token },
					message:"Login Successfuly."
				});
			}
			return res.status(200).send({ 
				status: true,
				data: {},
				message:"User not authorized."
			});

		} catch (error) {
			return res
			.status(500)
			.send({ status: false, message: "Internal server error : ", error });
		}
	},

  	// 
	adminLogin: async (req, res) => {
    	console.log("admin login");
		try {
		const { email, password } = req.body;
		const userRecord = await user.findByEmail(email);
		if (!userRecord) {
			res
			.status(401)
			.send({ status: false, message: "Authentication failed" });
			return;
		}
		const passwordMatch = await bcrypt.compare(password, userRecord.password);
		if (!passwordMatch) {
			res
			.status(401)
			.send({ status: false, message: "Authentication failed" });
			return;
		}
		delete userRecord.password;
		delete userRecord.otp;

		const role = userRecord.role_id == 1 ? "admin" : "user";
		let tokenObj = {
			userId: userRecord.user_id,
			role: role,
		};
		if(role == 'admin'){
			const token = jwt.sign(tokenObj, Util("JWT_KEY", "unsecureKey"));
			return res.status(200).send({ 
				status: true,
				data: { ...userRecord, token },
				message:"Login Successfuly."
			});
		}
		return res.status(200).send({ 
			status: true,
			data: {},
			message:"User not authorized."
		});
		
		} catch (error) {
		res
			.status(500)
			.send({ status: false, message: "Internal server error : ", error });
		}
	},

	//
	/**
	 * @swagger
	 * /users:
	 *  get:
	 *    description: Use to request all users
	 *    responses:
	 *      '200':
	 *        description: A successful response
	 *
	 */
	getUser: async (req, res) => {
		try {
		const userId = req.user.userId;
		const userRecord = await user.findById(userId);
		if (!userRecord) {
			res.status(404).send({ status: false, message: "User not found" });
			return;
		}
		delete userRecord.password;
		console.log(userRecord);
		let responseData = { ...userRecord };

		res
			.status(200)
			.send({ status: true, message: "User data", data: responseData });
		} catch (error) {
		res
			.status(500)
			.send({ status: false, message: "Internal server error: ", error });
		}
	},

	//
	updateUser: async (req, res) => {
		let { name, email, password, ...updateObj } = req.body;
		const userId = req.user.userId;

		try {
		const userRecord = await user.findById(userId);
		delete userRecord.password;
		delete userRecord.otp;

		updateObj = await user.updateById(userRecord.user_id, updateObj);
		if (updateObj.affectedRows > 0) {
			updateObj = await user.findById(userId);
		}

		return res.status(200).send({
			status: true,
			data: updateObj,
			message: "User updated successfully.",
		});
		} catch (error) {
		console.error(error);
		return res
			.status(500)
			.send({ status: false, message: "Error updating user: ", error });
		}
	},

	//
	getAllUsers: async (req, res) => {
		try {
		const { page = 1, limit = 25, search = "" } = req.query;
		const tableName = "users";
		const options = {
			page: parseInt(page, 10),
			limit: parseInt(limit, 10),
		};
		const offset = (options.page - 1) * options.limit;
		// Define the search criteria
		const searchCriteria = {
			template_name: req.query.search,
		};
		let userCondition = "";
		userCondition += search
			? `OR u.first_name LIKE '%${searchCriteria.template_name}%'`
			: "";
		userCondition += search
			? `OR u.last_name LIKE '%${searchCriteria.template_name}%'`
			: "";

		const userRecords = await user.findAllUsers(
			searchCriteria,
			userCondition,
			options,
			offset
		);

		// Calculate next and previous page numbers
		const totalCount = await template.tableCount(tableName);
		const totalPages = Math.ceil(totalCount[0].count / options.limit);
		const nextPage = options.page < totalPages ? options.page + 1 : null;
		const prevPage = options.page > 1 ? options.page - 1 : null;
		console.log("----", totalPages, nextPage, prevPage);
		if (!userRecords) {
			return res
			.status(200)
			.send({ status: true, data: [], message: "No User Found." });
		} else {
			console.log(userRecords.length);
			return res.status(200).send({
			status: true,
			data: userRecords,
			pagination: {
				totalResults: totalCount[0].count,
				totalPages: totalPages,
				nextPage: nextPage,
				prevPage: prevPage,
			},
			message: "User fetched successfully.",
			});
		}
		} catch (error) {
		res
			.status(500)
			.send({ status: false, message: "Internal server error: ", error });
		}
	},
};
