import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  await ch1.assertExchange('mytopicexchange', 'topic');

  const queue = await ch1.assertQueue('', { exclusive: true });

  ch1.bindQueue(queue.queue, 'mytopicexchange', '#.payments');

  ch1.consume(queue.queue, (msg) => {
    if (msg !== null) {
      console.log('(Second consumer) Received:', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();
