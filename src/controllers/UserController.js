import useragent from "express-useragent";
import { errorResponse, successResponse } from "../helpers/response";
import { create, fetchOne, isUnique, update } from "../helpers/schema";
import { generateVerificationLink } from "../utils/user";
import { sendMail } from "../utils/email";
import { decodeToken, generatePasswordResetLink, getIdfromToken, hashPassword, validatePassword } from "../utils/base";
import User from "../models/user";
import safeCompare from "safe-compare";


const signUp = async function (req, res) {
    try {
        const userAgent = useragent.parse(req.headers["user-agent"]).source;

        let { fullName, email, password } = req.body;

        let user, company, responseData, token, verificationLink, message;

        password = await hashPassword(password);

        user = {
            fullName, email, password
        };

        user = await createUser(req, res, user);

        token = await user.generateAuthToken(userAgent);

        verificationLink = await generateVerificationLink(user._id);

        message = `Hi ${user.fullName}, kindly click on this link to verify your HRaaS account. <a href="${verificationLink}">Verify</a>`;

        const send = await sendMail(
            user.email,
            `Verify Your HRaaS Account`,
            message,
            verificationLink,
            "Verify Account"
        );

        responseData = {
            payload: user,
            token,
            statusCode: 201,
            message: "A verification link has been sent to your email.",
        };
        return successResponse(res, responseData);
    } catch (error) {
        console.log(error)
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}


const createUser = async function (req, res, data) {
    const { email } = data;
    try {
        let user = await isUnique(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Email already registered to a company.",
            });
        }
        user = data;
        user = await create(User, user);
        return user;
    } catch (error) {
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};


const signIn = async function (req, res) {
    const { email, password } = req.body;
    let user, token;
    try {
        const userAgent = useragent.parse(req.headers["user-agent"]).source;
        user = await fetchOne(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User not found.",
            });
        }

        const passwordValid = await validatePassword(password, user.password);
        if (!passwordValid) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Invalid login credentials.",
            });
        }

        if (!user.isVerified) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Please confirm your email to login.",
            });
        }
        token = await user.generateAuthToken(userAgent);
        return successResponse(res, {
            statusCode: 200,
            message: "Login successful.",
            payload: user,
            token,
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }

}



const oAuth = async function (req, res) {
    const { email, firstName, lastName } = req.body;
    let token, user;
    const userAgent = useragent.parse(req.headers["user-agent"]).toString();
    try {
      console.log(req.body);
      user = await fetchOne(User, { email }, ["mailingPreferencesId"]);
      console.log(user);
      if (user == null) {
        user = await create(User, { email, firstName, lastName });
        const userAgent = useragent.parse(req.headers["user-agent"]).toString();
        token = await user.generateAuthToken(userAgent);
        //prep email data
        const emailData = {
          subject: "Welcome To Firacard",
          msgTo: user.email,
          bodyText: `Hello, welcome aboard`,
          isTransactional: true,
          templateId: 15410,
          firstName,
        };
        const mailUser = await sendMail(emailData);
        if (!mailUser) {
          await User.findByIdAndDelete(user._id);
          throw new Error("Error with email service.");
        }
        return successResponse(req, res, {
          statusCode: 201,
          status: "success",
          message: "oAuth registration successful.",
          payload: user,
          token,
        });
      }

      token = await user.generateAuthToken(userAgent);
      return successResponse(req, res, {
        statusCode: 200,
        status: "success",
        message: "oAuth login successful.",
        payload: user,
        token,
      });
    } catch (error) {
      console.log(error);
      return errorResponse(req, res, {
        statusCode: 500,
        status: "failure",
        message: "An error occured.",
        payload: null,
      });
    }
  }

const resendVerificationLink = async function (req, res) {
    const { email } = req.body;
    let user, verificationLink, html, send, message;
    try {
        user = await fetchOne(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "User not found.",
            });
        }
        verificationLink = await generateVerificationLink(user._id);
        message = `Hi ${user.fullName}, kindly click on this link to verify your HRaaS account. <a href="${verificationLink}">Verify</a>`;

        send = await sendMail(
            user.email,
            `Verify Your HRaaS Account`,
            message,
            verificationLink,
            "Verify Account"
        );

        if (send) {
            return successResponse(res, {
                statusCode: 200,
                message: "Account verification link sent.",
            });
        }
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};


const verifyAccount = async function (req, res) {
    const { token } = req.params;
    let user;
    try {
        const userId = await getIdfromToken(token);
        user = await update(User, { _id: userId }, { isVerified: true });
        if (!user) throw new Error("Unable to verify account at this time.");
        return successResponse(res, {
            statusCode: 200,
            message: "Account verification successful.",
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};


const sendPasswordResetLink = async function (req, res) {
    const { email } = req.body;
    let user, resetLink, message, send;
    try {
        user = await fetchOne(User, { email });
        if (!user)
            return errorResponse(res, {
                statusCode: 400,
                message: "User not found.",
            });
        resetLink = await generatePasswordResetLink(user._id);
        message = `Hi ${user.fullName}, kindly click on this link to reset your ColadGray HRaas account password. <a href="${resetLink}">Reset Password</a>`;
        send = await sendMail(
            user.email,
            `Reset Your ColadGray HRaaS Account`,
            message,
            resetLink,
            "Reset Password"
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Password reset link sent to your email.",
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

const resetPassword = async function (req, res) {
    const { token, new_password } = req.body;
    let decodedToken, user, password;
    try {
        decodedToken = await decodeToken(token);
        if (
            !decodedToken ||
            !safeCompare(decodedToken.tokenType, "passwordreset")
        ) {
            return successResponse(res, {
                statusCode: 400,
                message: "Invalid password reset token.",
            });
        }
        password = await hashPassword(new_password);
        user = await update(User, { _id: decodedToken.userId }, { password });
        return successResponse(res, {
            statusCode: 200,
            message:
                "Password reset successful, kindly login with your new password.",
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

export {
    signUp,
    signIn,
    resendVerificationLink,
    verifyAccount,
    sendPasswordResetLink,
    resetPassword,
    oAuth
}