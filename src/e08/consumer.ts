import amqplib from 'amqplib';

(async () => {
  const queue = 'tasks';
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();
  ch1.prefetch(1);
  await ch1.assertQueue(queue);

  ch1.consume(queue, async (msg) => {
    if (msg !== null) {
      await new Promise((r) => setTimeout(r, 2000));
      console.log(
        `Received: ${msg.content.toString()} | ${new Date().toUTCString()}`
      );
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();
