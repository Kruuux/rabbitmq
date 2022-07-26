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

  setInterval(() => {
    ch1.publish(
      mainExchange.exchange,
      'go-to-alternative',
      Buffer.from('something to do')
    );
  }, 1000);
})();
