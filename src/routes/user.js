import express from "express";
import { oAuth, resendVerificationLink, resetPassword, sendPasswordResetLink, signIn, signUp, verifyAccount } from "../controllers/UserController";
import { createUserValidator } from "../validators/users-validator";
import { loginValidator } from "../validators/login-validator";
import { resendVerificationLinkValidator } from "../validators/verification-links";
import { forgotPasswordValidator } from "../validators/forgot-password-validator";
import { resetPasswordValidator } from "../validators/reset-password-validator";

const Router = express.Router();

Router.post("/create-account", createUserValidator, signUp);
Router.post("/login", loginValidator, signIn);
Router.post("/social-auth", loginValidator, oAuth);
Router.post("/resend-verification-link", resendVerificationLinkValidator, resendVerificationLink);
Router.get("/verify-account/:token", verifyAccount);
Router.post("/forgot-password", forgotPasswordValidator, sendPasswordResetLink);
Router.post("/reset-password", resetPasswordValidator, resetPassword);
module.exports = Router;
