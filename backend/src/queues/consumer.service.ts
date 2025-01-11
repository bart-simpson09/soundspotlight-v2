import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { MailService } from "../emails/email.service";

@Injectable()
export class ConsumerService implements OnModuleInit {
    private channelWrapper: ChannelWrapper;
    private readonly logger = new Logger(ConsumerService.name);

    constructor(private emailService: MailService) {
        const connection = amqp.connect(['amqp://rabbitmq']);
        this.channelWrapper = connection.createChannel();
    }

    public async onModuleInit() {
        try {
            await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
                await channel.assertQueue('emailQueue', { durable: true });
                await channel.consume('emailQueue', async (message) => {
                    if (message) {
                        const content = JSON.parse(message.content.toString());
                        this.logger.log('Received message:', content);
                        try {
                            await this.emailService.send(content);
                            channel.ack(message);
                        } catch (error) {
                            this.logger.error('Failed to process message:', error.message);
                        }
                    }
                });
            });
            this.logger.log('Consumer service started and listening for messages.');
        } catch (err) {
            this.logger.error('Error starting the consumer:', err.message);
        }
    }
}
