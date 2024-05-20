const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CryptoJS = require("crypto-js");

const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(accessToken, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      try {
        const decodedAccessTokenCookie = jwt.decode(accessToken);

        const user = await User.findById(decodedAccessTokenCookie._id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const userData = user.toJSON();
        const newAccessToken = jwt.sign(userData, secretKey, { expiresIn: "12h" });
        res.cookie("accessToken", newAccessToken, { httpOnly: true, sameSite: "Lax" });
        req.cookies.accessToken = newAccessToken;
        req.user = userData;
        req.retryOperation = true; // Signal to the next middleware or route handler to retry
        next();
      } catch (newTokenError) {
        return res.status(500).json({ error: "Error generating a new token" });
      }
    } else {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
};

const decryptData = (data) => {
  try {
    const decryptedData = CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.log(error);
  }
};

const encryptData = (data) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
    return encryptedData;
  } catch (error) {
    console.log(error);
  }
};

const decryptObjectData = (data) => {
  try {
    const decryptedData = CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
    const decryptedDocument = JSON.parse(decryptedData);
    return decryptedDocument;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  verifyToken,
  decryptData,
  encryptData,
  decryptObjectData,
};
