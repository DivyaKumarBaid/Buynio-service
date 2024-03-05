import { Module } from '@nestjs/common';
import { HopsController } from './hops.controller';
import { HopsService } from './hops.service';

@Module({
  controllers: [HopsController],
  providers: [HopsService]
})
export class HopsModule {}
