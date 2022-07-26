import amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  ch1.assertExchange('mytopicexchange', 'topic');

  const userMsg = 'A european user paid for something';
  const orderMsg = 'A european business ordered goods';

  setInterval(() => {
    ch1.publish(
      'mytopicexchange',
      'user.europe.payments',
      Buffer.from(userMsg)
    );
  }, 1000);

  setInterval(() => {
    ch1.publish(
      'mytopicexchange',
      'business.europe.order',
      Buffer.from(orderMsg)
    );
  }, 1000);
})();
