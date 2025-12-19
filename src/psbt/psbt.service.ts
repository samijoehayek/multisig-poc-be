import { Injectable } from '@nestjs/common';
import { BitcoinService } from '../bitcoin/bitcoin.service';

@Injectable()
export class PsbtService {
  private readonly walletName = 'escrow-descriptor-wallet1765966441003';

  constructor(private readonly btc: BitcoinService) {}

  async listUtxos() {
    return this.btc.rpcCall('listunspent', [0], this.walletName);
  }

  async createSpend(
    walletName: string,
    toAddress: string,
    amount: number,
    feeRateSatVb: number,
  ) {
    console.log(
      `Creating spend from wallet ${walletName} to ${toAddress} amount ${amount} with fee rate ${feeRateSatVb} sat/vB`,
    );
    // For PoC: let Core choose inputs from watch-only descriptor wallet.
    // includeWatching is mandatory.
    const res = await this.btc.rpcCall(
      'walletcreatefundedpsbt',
      [
        [], // inputs
        [{ [toAddress]: amount }], // outputs as array
        0,
        {
          includeWatching: true,
          fee_rate: feeRateSatVb,
          subtractFeeFromOutputs: [0], // subtract fee from output #0
        },
        true,
      ],
      walletName,
    );

    return {
      psbt: res.psbt,
      fee: res.fee,
      changepos: res.changepos,
    };
  }

  async combine(psbts: string[]) {
    return this.btc.rpcCall('combinepsbt', [psbts]);
  }

  async finalize(psbt: string) {
    return this.btc.rpcCall('finalizepsbt', [psbt]);
  }

  async broadcast(hex: string) {
    return this.btc.rpcCall('sendrawtransaction', [hex]);
  }
}
