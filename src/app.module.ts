import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OfferingController } from './offering/offering.controller';
import { OfferingService } from './offering/offering.service';
import { OfferingModule } from './offering/offering.module';

@Module({
  imports: [OfferingModule],
  controllers: [AppController, OfferingController],
  providers: [AppService, OfferingService],
})
export class AppModule {}
