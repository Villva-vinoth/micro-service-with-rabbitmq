let channel;
const initializeRPCServer = async (_channel,handler = {}) => {
  channel =_channel;

  for (const pattern of Object.keys(handler)) {
    await channel.assertQueue(pattern, { durable: true });

    console.log(`RPC Server listening on: ${pattern}`);

    channel.consume(pattern, async (msg) => {
      try {
        const data = JSON.parse(msg.content.toString());

        const response = await handler[pattern](data);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          { correlationId: msg.properties.correlationId }
        );
        channel.ack(msg);
      } catch (error) {
        console.error("RPC Handler Error:", error);

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify({ error: error.message })),
          { correlationId: msg.properties.correlationId }
        );
        channel.ack(msg);
      }
    });
  }
};

module.exports = { initializeRPCServer };
