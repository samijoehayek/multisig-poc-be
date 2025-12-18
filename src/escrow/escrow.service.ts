import { Injectable } from '@nestjs/common';
import { BitcoinService } from '../bitcoin/bitcoin.service';
import { normalizeToTestnetXpub } from '../bitcoin/xpub.util';
import { range } from 'rxjs';

@Injectable()
export class EscrowService {
  private readonly walletName = 'escrow-descriptor-wallet';

  constructor(private readonly btc: BitcoinService) {}

  async createEscrow(params: {
    ledgerXpub: string;
    ledgerXfp: string;
    coldcardXpub: string;
    coldcardXfp: string;
    index: string;
  }) {
    const walletName = this.walletName + Date.now();
    await this.btc.ensureWallet(walletName);

    const { ledgerXfp, coldcardXfp, index } = params;

    const ledgerXpub = normalizeToTestnetXpub(params.ledgerXpub);
    const coldcardXpub = normalizeToTestnetXpub(params.coldcardXpub);

    // BIP48: m/48'/1'/0'/2' (regtest treated like testnet for derivation)
    // Child: /0/index (receive branch + index)
    const descriptorNoChecksum =
      `wsh(sortedmulti(2,` +
      `[${ledgerXfp}/48h/1h/0h/2h]${ledgerXpub}/0/${index},` +
      `[${coldcardXfp}/48h/1h/0h/2h]${coldcardXpub}/0/${index}` +
      `))`;

    const descInfo = await this.btc.rpcCall('getdescriptorinfo', [
      descriptorNoChecksum,
    ]);
    const descriptor = descInfo.descriptor; // includes checksum
    console.log('Descriptor with checksum:', descriptor);

    // Import into the SAME wallet we’ll use for address derivation and PSBT creation
    const importResult = await this.btc.rpcCall(
      'importdescriptors',
      [
        [
          {
            desc: descriptor,
            timestamp: 'now',
            active: true,
            range: [0, 100],
            internal: false,
          },
        ],
      ],
      walletName,
    );

    console.log(importResult);

    // Derive an address from the descriptor wallet (Core will pick the active descriptor)
    const address = await this.btc.rpcCall(
      'getnewaddress',
      ['', 'bech32'],
      walletName,
    );

    return { walletName: walletName, descriptor, address, index };
  }
}
