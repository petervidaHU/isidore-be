import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OfferingModule } from './offering/offering.module';

@Module({
  imports: [OfferingModule],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {}
