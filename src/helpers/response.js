import safeCompare from "safe-compare";

const errorResponse = async (res, data) => {
  let { statusCode, message } = data;
  return res
    .status(statusCode)
    .send({ status: "failure", statusCode, message, payload: null });
};

const successResponse = async (res, data) => {
  let { payload, statusCode, message, token } = data;
  if (safeCompare(token, undefined)) token = null;
  return res
    .status(statusCode)
    .send({ payload, statusCode, message, status: "success", token });
};

export { errorResponse, successResponse };
