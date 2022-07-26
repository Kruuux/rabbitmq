import amqplib from 'amqplib';
import { randomUUID } from 'crypto';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  const requestQueue = await ch1.assertQueue('request-queue');

  ch1.consume(requestQueue.queue, (msg) => {
    if (msg !== null) {
      console.log('Received:', msg.content.toString());

      ch1.ack(msg);

      ch1.publish(
        '',
        msg.properties.replyTo,
        Buffer.from(
          `Replying from the server to ${msg.properties.replyTo} with correlation id: ${msg.properties.correlationId}`
        ),
        {
          replyTo: msg.properties.replyTo,
          correlationId: randomUUID(),
        }
      );
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();
