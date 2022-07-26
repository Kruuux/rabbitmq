import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  const mainExchange = await ch1.assertExchange('main-exchange', 'direct');

  setInterval(() => {
    ch1.publish(
      mainExchange.exchange,
      '',
      Buffer.from('This message will expire')
    );
  }, 1000);
})();
