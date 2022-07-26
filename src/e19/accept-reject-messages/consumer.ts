import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  const mainExchange = await ch1.assertExchange(
    'accept-reject-exchange',
    'fanout'
  );

  const mainQueue = await ch1.assertQueue('');
  await ch1.bindQueue(mainQueue.queue, mainExchange.exchange, '');

  ch1.consume(mainQueue.queue, async (msg) => {
    if (msg !== null) {
      // if (msg.fields.deliveryTag % 5 === 0)
      ch1.ack(msg, true);
      console.log('Main Received:', msg.content.toString());
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();
