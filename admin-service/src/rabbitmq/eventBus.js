let channel = null;

function initEventBus(ch) {
  channel = ch;
  console.log("EventBus initialized");

}

async function publishEvent(exchangeName, routingKey, payload = {}, options = {}) {
  if (!channel) throw new Error("EventBus Not Initialized!");

  await channel.assertExchange(exchangeName, "topic", { durable: true });

  channel.publish(
    exchangeName,
    routingKey,
    Buffer.from(JSON.stringify(payload)),
    {
      persistent: true,
      contentType: "application/json",
      ...options,
    }
  );

  console.log(`Event Published -> [${exchangeName}] ${routingKey}`);
}

module.exports = { initEventBus, publishEvent };
