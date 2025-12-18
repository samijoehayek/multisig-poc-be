import { Module } from '@nestjs/common';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { EscrowModule } from './escrow/escrow.module';
import { PsbtModule } from './psbt/psbt.module';

@Module({
  imports: [BitcoinModule, EscrowModule, PsbtModule],
})
export class AppModule {}
