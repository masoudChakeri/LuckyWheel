import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://admin:password@rabbitmq:5672'); 
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('error_logs'); 
  }

  async publishErrorLog(error: string) {
    this.channel.sendToQueue('error_logs', Buffer.from(error));
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}