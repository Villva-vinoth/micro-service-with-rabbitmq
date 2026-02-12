const { RPCRequest } = require("../rabbitMQ/rpc");
const { generateToken } = require("../utils/generateToken");

const router = require("express").Router();

router.post("/register", async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.email || !data.password) {
      return res.status(400).json({
        success: false,
        message: "Email & password are required"
      });
    }

    const rpc_response = await RPCRequest("admin.register", data);

    if (rpc_response.error) {
      console.log("Error:", rpc_response.error);
      return res.status(rpc_response.status || 400).json({
        success: false,
        message: rpc_response.error
      });
    }

    return res.status(201).json({
      success: true,
      data: rpc_response.data,
      message: rpc_response.message || "Admin registered, OTP sent"
    });
    
  } catch (error) {
    next(error);
  }
});

router.post("/resendOTP", async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const rpc_response = await RPCRequest("admin.resendOtp", data);

    if (rpc_response.error) {
      console.log("Error:", rpc_response.error);
      return res.status(rpc_response.status || 400).json({
        success: false,
        message: rpc_response.error
      });
    }

    return res.status(200).json({
      success: true,
      data: rpc_response.data,
      message: rpc_response.message || "Admin Resend OTP sent"
    });
    
  } catch (error) {
    next(error);
  }
});

router.post("/verifyOTP", async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.email || !data.otp) {
      return res.status(400).json({
        success: false,
        message: "Email  & OTP are required"
      });
    }

    const rpc_response = await RPCRequest("admin.verifyOtp", data);

    if (rpc_response.error) {
      console.log("Error:", rpc_response.error);
      return res.status(rpc_response.status || 400).json({
        success: false,
        message: rpc_response.error
      });
    }

    return res.status(200).json({
      success: true,
      data: rpc_response.data,
      message: rpc_response.message || "Admin verified"
    });
    
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.email || !data.password) {
      return res.status(400).json({
        success: false,
        message: "Email  & password are required"
      });
    }

    const rpc_response = await RPCRequest("admin.login", data);

    if(rpc_response.data){
        rpc_response.data.token = generateToken({id:rpc_response.data._id, email:rpc_response.data.email});
    }
    
    if (rpc_response.error) {
      console.log("Error:", rpc_response.error);
      return res.status(rpc_response.status || 400).json({
        success: false,
        message: rpc_response.error
      });
    }

    return res.status(200).json({
      success: true,
      data: rpc_response.data,
      message: rpc_response.message || "Admin Login Successfully!"
    });
    
  } catch (error) {
    next(error); 
  }
});

module.exports = router;
