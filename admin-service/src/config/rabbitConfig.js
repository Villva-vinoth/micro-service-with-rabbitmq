const amqplib = require("amqplib");

let channel, connection;
const connectRabbitMQ = async () => {
  try {
    connection = await amqplib.connect(process.env.AMQP_URL);
    channel = await connection.createChannel();
    console.log("RabbitMQ connected");

    return { channel, connection };
  } catch (error) {
    console.error("RabbitMQ connection failed:", error);

    throw error;
  }
};

module.exports = { connectRabbitMQ };
