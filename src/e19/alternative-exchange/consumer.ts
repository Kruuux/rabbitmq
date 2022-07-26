import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  const alternativeExchange = await ch1.assertExchange(
    'alt-exchange',
    'fanout'
  );
  const mainExchange = await ch1.assertExchange('main-exchange', 'direct', {
    alternateExchange: alternativeExchange.exchange,
  });

  const alternativeQueue = await ch1.assertQueue('');
  await ch1.bindQueue(alternativeQueue.queue, alternativeExchange.exchange, '');

  const mainQueue = await ch1.assertQueue('');
  await ch1.bindQueue(mainQueue.queue, mainExchange.exchange, 'main');

  ch1.consume(alternativeQueue.queue, (msg) => {
    if (msg !== null) {
      console.log('Alternative Received:', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });

  ch1.consume(mainQueue.queue, (msg) => {
    if (msg !== null) {
      console.log('Main Received:', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();
