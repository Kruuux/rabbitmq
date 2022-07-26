import amqplib from 'amqplib';
import { randomUUID } from 'crypto';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  const replyQueue = await ch1.assertQueue('');

  const requestQueue = await ch1.assertQueue('request-queue');

  ch1.consume(replyQueue.queue, (msg) => {
    if (msg !== null) {
      console.log('Received:', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by client');
    }
  });

  setInterval(() => {
    ch1.publish('', requestQueue.queue, Buffer.from('Can i request a reply?'), {
      replyTo: replyQueue.queue,
      correlationId: randomUUID(),
    });
  }, 1000);
})();
