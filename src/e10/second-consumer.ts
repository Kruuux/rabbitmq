import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  await ch1.assertExchange('pubsub', 'fanout');

  const queue = await ch1.assertQueue('', { exclusive: true });

  // ch1.bindQueue(queue.queue, 'pubsub', '');

  ch1.consume(queue.queue, async (msg) => {
    if (msg !== null) {
      await new Promise((r) => setTimeout(r, 2000));
      console.log(
        `(Second consumer) Received: ${msg.content.toString()} | ${new Date().toUTCString()}`
      );
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();
