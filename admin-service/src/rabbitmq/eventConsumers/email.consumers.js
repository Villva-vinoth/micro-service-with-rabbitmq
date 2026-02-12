const { sendOTPMail, pushEmail } = require("../../service/emailService");

const emailConsumer = async (channel) => {
    const EXCHANGE = "email_exchange";

    await channel.assertExchange(EXCHANGE, "topic", { durable: true });

    const q = await channel.assertQueue("email_queue", { durable: true });

    // listen to ALL email.* events
    await channel.bindQueue(q.queue, EXCHANGE, "email.#");

    console.log("[EMAIL CONSUMER] Started");

    channel.consume(q.queue, async (msg) => {
        const eventData = JSON.parse(msg.content.toString());
        const routingKey = msg.fields.routingKey;

        console.log("[EMAIL EVENT]", routingKey, eventData);

        try {
            switch (routingKey) {

                case "email.admin.created":
                    await sendOTPMail(eventData);
                    break;

                case "email.admin.otp.resend":
                    await sendOTPMail(eventData);
                    break;

                case "email.user.created":
                    await pushEmail(eventData);
                    break;

                default:
                    console.log("No handler for:", routingKey);
            }

            channel.ack(msg);

        } catch (error) {
            console.error("Email Handler Error:", error);
            channel.nack(msg, false, false);
        }
    });
};

module.exports = { emailConsumer };
