import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();
  await ch1.assertExchange('pubsub', 'fanout');

  setInterval(() => {
    console.log(`Broadcast: something to do | ${new Date().toUTCString()}`);

    ch1.publish('pubsub', '', Buffer.from('something to do'));
  }, 1000);
})();
