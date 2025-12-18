import { Body, Controller, Get, Post } from '@nestjs/common';
import { PsbtService } from './psbt.service';
import { CreateSpendDto } from './dto/create-spend.dto';
import { CombineDto } from './dto/combine.dto';
import { FinalizeDto } from './dto/finalize.dto';
import { BroadcastDto } from './dto/broadcast.dto';

@Controller('psbt')
export class PsbtController {
  constructor(private readonly psbt: PsbtService) {}

  @Get('utxos')
  async utxos() {
    return this.psbt.listUtxos();
  }

  @Post('create-spend')
  async createSpend(@Body() dto: CreateSpendDto) {
    return this.psbt.createSpend(
      dto.walletName,
      dto.toAddress,
      dto.amount,
      dto.feeRateSatVb,
    );
  }

  @Post('combine')
  async combine(@Body() dto: CombineDto) {
    return this.psbt.combine(dto.psbts);
  }

  @Post('finalize')
  async finalize(@Body() dto: FinalizeDto) {
    return this.psbt.finalize(dto.psbt);
  }

  @Post('broadcast')
  async broadcast(@Body() dto: BroadcastDto) {
    return this.psbt.broadcast(dto.hex);
  }
}
