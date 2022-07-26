import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  await ch1.assertExchange('headers-exchange', 'headers');

  const message = 'This message will be sent with headers';

  setInterval(() => {
    console.log(`Broadcast: ${message} | ${new Date().toUTCString()}`);

    ch1.publish('headers-exchange', '', Buffer.from(message), {
      headers: { name: 'brian' },
    });
  }, 1000);
})();
