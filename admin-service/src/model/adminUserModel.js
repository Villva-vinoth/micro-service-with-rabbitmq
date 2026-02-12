const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      default: 0,
      comment: "1-admin,2-sub-admin",
    },
    status: {
      type: Number,
      default: 1,
      comment: "1-active,2-inactive",
    },
    otp: {
      type: String,
    },
    otpExpireAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
  }
);


adminUserSchema.index({
  email: 1,
});


module.exports = mongoose.model("AdminUser", adminUserSchema);
