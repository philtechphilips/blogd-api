import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
  

  const validatePassword = async function (reqPassword, userPassword) {
    const isValid = await bcrypt.compare(reqPassword, userPassword);
    if (isValid) return true;
    return false;
  };

  const getIdfromToken = async function (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.userId;
  };

  const generatePasswordResetLink = async function (userId) {
    const resetToken = jwt.sign(
      { userId, tokenType: "passwordreset" },
      process.env.JWT_SECRET,
      {
        expiresIn: "15 minutes",
      }
    );
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;
    return resetLink;
  };


  const decodeToken = async function (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  };


  export{
    hashPassword,
    validatePassword,
    getIdfromToken,
    generatePasswordResetLink,
    decodeToken
  }