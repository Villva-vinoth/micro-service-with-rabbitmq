const {
  createAdminUser,
  resendOTP,
  verifyUserOTP,
  getOneUser,
  updateUser,
  deleteUser,
  getAllUser,
} = require("../service/adminUser");

const createAdminUserHandler = async (data) => {
  try {
    const adminUser = await createAdminUser(data);
    return {
      success: true,
      data: adminUser,
      message: "Admin Created Successfully!, Please check your email for OTP",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Creation Error ",
    };
  }
};

const verifyUserOTPHandler = async (data) => {
  try {
    const adminUser = await verifyUserOTP(data);

    return {
      success: true,
      data: adminUser,
      message: "OTP Verified Successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Verification Error",
    };
  }
};

const resendOTPHandler = async (data) => {
  try {
    const adminUser = await resendOTP(data);

    return {
      success: true,
      data: adminUser,
      message: "OTP Resend Successfully!, Please check your email for OTP",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Resend Error ",
    };
  }
};

const loginHandler = async (data) => {
  try {
    const { email, password } = data;
    const user = await getOneUser(data,true);

    if (!user) {
      return {
        success: false,
        message: "User Not Found",
      };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Invalid Password",
      };
    }

    return {
      success: true,
      data: user,
      message: "Login Successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Login Error ",
    };
  }
};

const getAllUserHandler = async (data) => {
  try {

    const users = await getAllUser(data);
  
    return {
      success: true,
      data: users,
      message: "Get All Users Successfully!",
    };
    
  } catch (error) {
     return {
       success: false,
       message: error.message || "Get User Error ",
     }
  }
};

const getOneUserHandler = async (data) => {
  try {

    const user = await getOneUser(data);
   
    if (!user) {
      return {
        success: false,
        message: "User Not Found",
      };
    }

    return {
      success: true,
      data: user,
      message: "Get User Successfully!",
    };
    
  } catch (error) {
     return {
       success: false,
       message: error.message || "Get User Error ",
     }
  }
};

const updateUserHandler = async (data) => {
  try {

    const user = await updateUser(data);
   
    if (!user) {
      return {
        success: false,
        message: "User Not Found",
      };
    }

    return {
      success: true,
      data: user,
      message: "Update User Successfully!",
    };
  } catch (error) {
     return {
       success: false,
       message: error.message || "Update User Error ",
     }
  }
};

const deleteUserHandler = async (data) => {
  try {

    const user = await deleteUser(data);
   
    return {
      success: true,
      data: user,
      message: "Delete User Successfully!",
    }
    
  } catch (error) {
    return {
      success: false,
      message: error.message || "Delete User Error ",
    }
  }
};

module.exports = {
  createAdminUserHandler,
  verifyUserOTPHandler,
  resendOTPHandler,
  loginHandler,
  getOneUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUserHandler
};
