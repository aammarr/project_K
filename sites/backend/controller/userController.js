import user from "../models/user.js";
import Util from "../helper/util.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
  // 
  register: async (req, res) => {
    console.log("register")
    try {
      // const { type } = req?.params =='user' ?2:'';

      const { email, password, ...profileData } = req.body;

      const userRecord = await user.findByEmail(email);
      if (userRecord) {
        return res.status(401).send({ status: false, message: 'Email already exist' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // const account_type = type || 'user';
      await user.create({email, password: hashedPassword, ...profileData });
      
      return res.status(200).send({ status: true, message: 'User created successfully' });
    } catch (error) {
      return res.status(500).send({ status: false, message: 'Internal server error', error });
    }
  },

  // 
  login: async (req, res) => {
    console.log("login");
    try {
        const { email, password } = req.body;
        const userRecord = await user.findByEmail(email);
        if (!userRecord) {
            res.status(401).send({ status: false, message: 'Authentication failed' });
            return;
        }
        const passwordMatch = await bcrypt.compare(password, userRecord.password);
        if (!passwordMatch) {
            res.status(401).send({ status: false, message: 'Authentication failed' });
            return;
        }
        delete userRecord.password;
        delete userRecord.otp;
        
        const role = userRecord.role_id==1?'admin':'user';
        let tokenObj = { 
            userId: userRecord.user_id ,
            role: role
        };
        console.log(tokenObj)
        const token = jwt.sign(
            tokenObj,
            Util("JWT_KEY", "unsecureKey"),
        );
        res.status(200).send({ status: true, data: {...userRecord, token }});
    } catch (error) {
        res.status(500).send({ status: false, message: 'Internal server error : ', error });
    }
  },

  // 
  getUser: async (req, res) => {
    try {
        
        const userId = req.user.userId;
        const userRecord = await user.findById(userId);
        if (!userRecord) {
            res.status(404).send({ status: false, message: 'User not found' });
            return;
        }
        delete userRecord.password;
        console.log(userRecord);
        let responseData = { ...userRecord };
        
        res.status(200).send({ status: true,message: 'User data', data : responseData});
    } catch (error) {
      res.status(500).send({ status: false, message: 'Internal server error: ', error });
    }
  },

  // 
  updateUser : async (req, res) => {
    let { name, email, password, ...updateObj } = req.body;
    const userId = req.user.userId;
    
    try {
      const userRecord = await user.findById(userId);
      delete userRecord.password;
      delete userRecord.otp;
      let tokenObj = { 
        userId: userRecord.user_id,
        role_id: userRecord.role_id 
      };
      updateObj = Object.assign({user_id: userId}, updateObj);
      console.log(updateObj)
    
      const token = jwt.sign(
        tokenObj,
        Util("JWT_KEY", "unsecureKey"),
      );
      
    return res.status(200).send({ status: true, message: 'User data' , data : {token}});
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Error updating user: ', error });
  }
  },
};
