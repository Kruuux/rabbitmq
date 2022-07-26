import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  const mainExchange = await ch1.assertExchange(
    'accept-reject-exchange',
    'fanout'
  );

  setInterval(() => {
    ch1.publish(mainExchange.exchange, 'test', Buffer.from('Lets send it'));
  }, 1000);
})();
