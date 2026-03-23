import { Module } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';

@Module({
  providers: [OpportunitiesService],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
