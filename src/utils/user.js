import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateVerificationLink = async function (userId) {
  const verificationToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1 hour",
  });
  const verificationLink = `${process.env.FRONTEND_URL}/Auth/Verification/${verificationToken}`;
  return verificationLink;
};


export{
    generateVerificationLink
}