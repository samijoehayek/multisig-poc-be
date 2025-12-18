import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateEscrowDto } from './dto/create-escrow.dto';
import { EscrowService } from './escrow.service';
import { BitcoinService } from '../bitcoin/bitcoin.service';

@Controller('escrow')
export class EscrowController {
  constructor(
    private readonly escrow: EscrowService,
    private readonly btc: BitcoinService,
  ) {}

  @Post('create')
  async create(@Body() dto: CreateEscrowDto) {
    return this.escrow.createEscrow(dto);
  }

  @Get(':walletName/utxos')
  getUtxos(@Param('walletName') walletName: string) {
    return this.btc.rpcCall('listunspent', [0], walletName);
  }
}
