const { RPCRequest } = require("../rabbitMQ/rpc");

const router = require("express").Router();

router.get("/getAllUsers", async (req, res, next) => {
  try {
    const data = req.body;

    const rpc_response = await RPCRequest("admin.getAll", data);

    if (rpc_response.error) {
      console.log("Error:", rpc_response.error);
      return res.status(rpc_response.status || 400).json({
        success: false,
        message: rpc_response.error,
      });
    }
    return res.status(200).json({
      success: true,
      data: rpc_response.data,
      message: rpc_response.message || "Get All Users Successfully!",
    });
  } catch (error) {
    next(res);
  }
});

router.get("/getUser", async (req, res, next) => {
  try {
    const data = {...req.body,...req.params};

    const rpc_response = await RPCRequest("admin.getOne", data);

    if (rpc_response.error) {
      console.log("Error:", rpc_response.error);
      return res.status(rpc_response.status || 400).json({
        success: false,
        message: rpc_response.error,
      });
    }
    return res.status(200).json({
      success: true,
      data: rpc_response.data,
      message: rpc_response.message || "Get User Successfully!",
    });
  } catch (error) {
    next(res);
  }
});

router.patch("/updateUser", async (req, res, next) => {
  try {
    const data = req.body;

    const rpc_response = await RPCRequest("admin.update", data);

    if (rpc_response.error) {
      console.log("Error:", rpc_response.error);
      return res.status(rpc_response.status || 400).json({
        success: false,
        message: rpc_response.error,
      });
    }
    return res.status(200).json({
      success: true,
      data: rpc_response.data,
      message: rpc_response.message || "User Updated Successfully!",
    });
  } catch (error) {
    next(res);
  }
});

router.delete("/deleteUser", async (req, res, next) => {
  try {
    const data = {...req.body,...req.params};

    const rpc_response = await RPCRequest("admin.delete", data);

    if (rpc_response.error) {
      console.log("Error:", rpc_response.error);
      return res.status(rpc_response.status || 400).json({
        success: false,
        message: rpc_response.error,
      });
    }
    return res.status(200).json({
      success: true,
      data: rpc_response.data,
      message: rpc_response.message || "User Deleted Successfully!",
    });
  } catch (error) {
    next(res);
  }
});
module.exports = router;
