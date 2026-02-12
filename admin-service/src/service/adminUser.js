const adminModel = require("../model/adminUserModel");
const { publishEvent } = require("../rabbitmq/eventBus");
const { generateOTP } = require("../utils/generateOTP");
const bcrypt = require("bcrypt");

const projection = {
  password: 0,
  __v: 0,
  otp: 0,
  otpExpireAt: 0,
  updatedAt: 0,
};

const createAdminUser = async (data) => {
  try {
    const adminUser = await adminModel.findOne({ email: data.email });
    if (adminUser) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    data.otp = generateOTP();
    data.otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);
    const createUser = new adminModel(data);
    await createUser.save();

    await publishEvent("email_exchange", "email.admin.created", {
      email: adminUser.email,
      otp: adminUser.otp,
      subject: "Admin Registration OTP",
    });

    const opt = {
      id: createUser._id,
      email: createUser.email,
    };

    return opt;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const verifyUserOTP = async (data) => {
  try {
    const user = await adminModel.findOne({ email: data.email });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.otp !== data.otp) {
      throw new Error("Invalid OTP");
    }

    if (user.otpExpireAt < Date.now()) {
      throw new Error("OTP Expired");
    }

    const opt = {
      id: createUser._id,
      email: createUser.email,
    };

    return opt;
  } catch (error) {
    throw error;
  }
};

const resendOTP = async (data) => {
  try {
    const user = await adminModel.findOne({ email: data.email });
    if (!user) {
      throw new Error("User not found");
    }
    user.otp = generateOTP();
    user.otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await publishEvent("email_exchange", "email.admin.otp.resend", {
      email: user.email,
      otp: user.otp,
      subject: "Admin Resend OTP",
    });

    const opt = {
      id: user._id,
      email: user.email,
    };

    return opt;
  } catch (error) {
    throw error;
  }
};

const getAllUser = async (data) => {
  try {
    const users = await adminModel.find({}, projection);
    return users;
  } catch (error) {
    throw error;
  }
}
const getOneUser = async (data, getPss = false ) => {
  try {
    let query = {};
    if (id) {
      query._id = id;
    }
    if (email) {
      query.email = email;
    }

    if(getPss){
        delete projection.password
    }

    const user = await adminModel.findOne(query,projection);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (data) => {
  const { id, ...rest } = data;
  try {
    const user = await adminModel.findOneAndUpdate(
      { _id: id },
      { $set: rest },
      { new: true },
      projection
    );
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (data) => {
  const { id } = data;
  try {
    const user = await adminModel.findByIdAndDelete({ _id: id });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { createAdminUser, verifyUserOTP, resendOTP, getOneUser ,updateUser, deleteUser, getAllUser };
