import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  await ch1.assertExchange('first-exchange', 'direct');
  await ch1.assertExchange('second-exchange', 'fanout');

  ch1.bindExchange('second-exchange', 'first-exchange', '');

  const message = 'This message has gone through multiple exchanges';

  setInterval(() => {
    console.log(`Broadcast: ${message} | ${new Date().toUTCString()}`);

    ch1.publish('first-exchange', '', Buffer.from('something to do'));
  }, 1000);
})();
