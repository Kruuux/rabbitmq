import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  await ch1.assertExchange('headers-exchange', 'headers');

  const queue = await ch1.assertQueue('letterbox');

  const bindArgs = { 'x-match': 'any', name: 'brian', age: 53 };

  ch1.bindQueue(queue.queue, 'headers-exchange', '', bindArgs);

  ch1.consume(queue.queue, async (msg) => {
    if (msg !== null) {
      console.log(
        `Received: ${msg.content.toString()} | ${new Date().toUTCString()}`
      );
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();
