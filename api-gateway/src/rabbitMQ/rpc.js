const { connectRabbitMQ } = require("../config/rabbitConfig");
const { v4: uuid } = require("uuid");

const pending = new Map();
let channel, replyQueue;

const InitializeRPC = async () => {
  const con = await connectRabbitMQ();
  channel = con.channel;

  replyQueue = await channel.assertQueue("", { exclusive: true });

  console.log("RPC reply queue created:", replyQueue.queue);

  channel.consume(
    replyQueue.queue,
    (msg) => {
      const correlationId = msg.properties.correlationId;

      if (!pending.has(correlationId)) return;

      const { resolve, timer } = pending.get(correlationId);
      clearTimeout(timer);
      pending.delete(correlationId);

      resolve(JSON.parse(msg.content.toString()));
    },
    { noAck: true }
  );

  console.log("RPC reply queue ready:", replyQueue.queue);
};

const RPCRequest = async (queueName, payload, timeout = 5000) => {
  if (!channel) await InitializeRPC();

  const correlationId = uuid();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(correlationId);
      return reject(new Error(`RPC timeout for ${queueName}`));
    }, timeout);

    pending.set(correlationId, { resolve, reject, timer, createdAt: Date.now() });

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(payload)),
      {
        replyTo: replyQueue.queue,
        correlationId
      }
    );
  });
};

setInterval(() => {
  const now = Date.now();
  for (const [id, obj] of pending.entries()) {
    if (now - obj.createdAt > 300_000) { // 5 mins
      clearTimeout(obj.timer);
      pending.delete(id);
    }
  }
}, 300_000);

module.exports = { InitializeRPC, RPCRequest };
