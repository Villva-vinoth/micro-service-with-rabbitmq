const {
  createAdminUserHandler,
  verifyUserOTPHandler,
  resendOTPHandler,
  loginHandler,
  getOneUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUserHandler,
} = require("../controller/adminUserController");

const adminHandler = {
  "admin.register": createAdminUserHandler,
  "admin.resendOtp": verifyUserOTPHandler,
  "admin.verifyOtp": resendOTPHandler,
  "admin.login": loginHandler,
  "admin.getOne": getOneUserHandler,
  "admin.update": updateUserHandler,
  "admin.delete": deleteUserHandler,
  "admin.getAll": getAllUserHandler,
};

module.exports = { adminHandler };
