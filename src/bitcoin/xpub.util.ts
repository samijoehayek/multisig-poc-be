import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';

const bip32 = BIP32Factory(ecc);

/**
 * Convert a mainnet xpub serialization to testnet/regtest (tpub).
 * This safely re-serializes with testnet version bytes.
 */
export function xpubToTpub(xpub: string): string {
  // Parse as mainnet
  const node = bip32.fromBase58(xpub, bitcoin.networks.bitcoin);

  // Manually re-encode with testnet version bytes
  return bip32
    .fromPublicKey(node.publicKey, node.chainCode, bitcoin.networks.testnet)
    .toBase58();
}

export function normalizeToTestnetXpub(x: string): string {
  if (x.startsWith('tpub')) return x;
  if (x.startsWith('xpub')) return xpubToTpub(x);
  throw new Error(`Unsupported extended pubkey prefix: ${x.slice(0, 4)}`);
}
