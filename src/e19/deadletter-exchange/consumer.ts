import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  const dlxExchange = await ch1.assertExchange('dlx-exchange', 'fanout');
  const mainExchange = await ch1.assertExchange('main-exchange', 'direct');

  const mainQueue = await ch1.assertQueue('', {
    deadLetterExchange: dlxExchange.exchange,
    messageTtl: 1000,
  });
  await ch1.bindQueue(mainQueue.queue, mainExchange.exchange, '');

  const dlxQueue = await ch1.assertQueue('');
  await ch1.bindQueue(dlxQueue.queue, dlxExchange.exchange, '');

  // Turned off to test dead letter exchange
  // ch1.consume(mainQueue.queue, async (msg) => {
  //   if (msg !== null) {
  //     console.log('Main Received:', msg.content.toString());
  //     ch1.ack(msg);
  //   } else {
  //     console.log('Consumer cancelled by server');
  //   }
  // });

  ch1.consume(dlxQueue.queue, (msg) => {
    if (msg !== null) {
      console.log('Dead letter Received:', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();
