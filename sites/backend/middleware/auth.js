import jwt from "jsonwebtoken";
const verify = jwt.verify;
import  appEnv  from "../helper/util.js";

export default function(req, res, next) {
  // if (!config.get("requiresAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ status: false, message: "Access denied. No token provided."});

  try {
    const decoded = verify(token, appEnv('JWT_KEY'));
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(400).send({ status: false, message: "Invalid token.", ex});
  }
};
