const amqplib = require("amqplib");
let channel, connection;
const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.AMQP_URL);
        channel = await connection.createChannel();
        return {channel, connection };
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

module.exports = { connectRabbitMQ };