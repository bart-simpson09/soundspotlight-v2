import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class ProducerService {
    private channelWrapper: ChannelWrapper;

    constructor() {
        const connection = amqp.connect(['amqp://rabbitmq']);
        this.channelWrapper = connection.createChannel({
            setup: async (channel: Channel) => {
                try {
                    await channel.assertQueue('emailQueue', { durable: true });
                } catch (error) {
                    Logger.error('Error asserting queue:', error.message);
                }
            },
        });
    }

    async addToEmailQueue(mail: any) {
        try {
            await this.channelWrapper.sendToQueue(
                'emailQueue',
                Buffer.from(JSON.stringify(mail)),
                {
                    persistent: true,
                },
            );
            Logger.log('Message sent to queue.');
        } catch (error) {
            throw new HttpException(
                'Error adding mail to queue',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
