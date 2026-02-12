const {connectDb} = require("./config/mongoConfig");
const express = require('express');
const {
  createAdminUserHandler,
  resendOTPHandler,
  verifyUserOTPHandler,
} = require("./controller/adminUserController");

const { initializeRPCServer } = require("./rabbitmq/rpc");
const {connectRabbitMQ} = require("./config/rabbitConfig");
const { initEventBus } = require("./rabbitmq/eventBus");
const { emailConsumer } = require("./rabbitmq/eventConsumers/email.consumers");
const { adminHandler } = require("./handler/adminHandler");

const app = express();

app.use(express.json());

connectDb();

const handler ={
 ...adminHandler,
};

(async () => {
    const con = await connectRabbitMQ();
    const channel = con.channel;

    // console.log("RabbitMQ Connected");

    // start event bus
    await initEventBus(channel);
   
    //start RPC SERVER
    await initializeRPCServer(channel, handler);

    //start Consumer
    await emailConsumer(channel);


})();



const port = process.env.PORT || 4002;
app.listen(4002, () => console.log("Server started on port",port));
