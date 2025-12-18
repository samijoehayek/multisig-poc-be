import { Module } from '@nestjs/common';
import { BitcoinModule } from '../bitcoin/bitcoin.module';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './escrow.service';

@Module({
  imports: [BitcoinModule],
  controllers: [EscrowController],
  providers: [EscrowService],
})
export class EscrowModule {}
