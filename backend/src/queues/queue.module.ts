import {Module} from '@nestjs/common';
import {ConsumerService} from './consumer.service';
import {ProducerService} from './producer.service';
import {EmailModule} from "../emails/email.module";

@Module({
    imports: [EmailModule],
    providers: [ProducerService, ConsumerService],
    exports: [ProducerService],
})
export class QueueModule {
}