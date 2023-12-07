import appEnv from "../helper/util.js";

export default function() {
  if (!appEnv('JWT_KEY', "unsecureKey")) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}