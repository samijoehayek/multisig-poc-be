import { Injectable } from '@nestjs/common';
import { BitcoinRPC } from './rpc';

@Injectable()
export class BitcoinService {
  // update creds/host to match your bitcoin.conf
  private rpc = new BitcoinRPC('http://127.0.0.1:18443', 'admin1', '123');

  rpcCall(method: string, params: any[] = [], wallet?: string) {
    return this.rpc.call(method, params, wallet);
  }

  async ensureWallet(walletName: string) {
    try {
      await this.rpcCall('createwallet', [
        walletName, // unique name to avoid "already exists"
        true, // disable_private_keys (watch-only)
        true, // blank
        '',
        false, // avoid_reuse
        true, // descriptors
      ]);

      console.log(
        `Wallet ${walletName} created as watch-only descriptor wallet.`,
      );
    } catch (e: any) {
      console.log('We have a error');
    }
  }
}
