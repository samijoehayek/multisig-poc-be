import { Module } from '@nestjs/common';
import { BitcoinModule } from '../bitcoin/bitcoin.module';
import { PsbtController } from './psbt.controller';
import { PsbtService } from './psbt.service';

@Module({
  imports: [BitcoinModule],
  controllers: [PsbtController],
  providers: [PsbtService],
})
export class PsbtModule {}
