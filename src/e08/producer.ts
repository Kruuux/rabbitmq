import amqplib from 'amqplib';

(async () => {
  const queue = 'tasks';
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue);

  setInterval(() => {
    console.log(`Produced: something to do | ${new Date().toUTCString()}`);

    ch1.sendToQueue(queue, Buffer.from('something to do'));
  }, 1000);
})();
