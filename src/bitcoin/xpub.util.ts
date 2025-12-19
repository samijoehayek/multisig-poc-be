import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { createHash } from 'crypto';

const bip32 = BIP32Factory(ecc);

// Base58 alphabet
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function decodeBase58Check(str: string): Buffer {
  let num = BigInt(0);
  for (const char of str) {
    num = num * 58n + BigInt(ALPHABET.indexOf(char));
  }
  let hex = num.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  // Pad to 82 bytes (78 data + 4 checksum) = 164 hex chars
  while (hex.length < 164) hex = '0' + hex;
  const bytes = Buffer.from(hex, 'hex');
  return bytes.slice(0, -4); // remove checksum
}

function encodeBase58Check(buffer: Buffer): string {
  const checksum = createHash('sha256')
    .update(createHash('sha256').update(buffer).digest())
    .digest()
    .slice(0, 4);
  const full = Buffer.concat([buffer, checksum]);
  let num = BigInt('0x' + full.toString('hex'));
  let str = '';
  while (num > 0n) {
    str = ALPHABET[Number(num % 58n)] + str;
    num = num / 58n;
  }
  // Leading zeros
  for (const byte of full) {
    if (byte === 0) str = '1' + str;
    else break;
  }
  return str;
}

/**
 * Convert a mainnet xpub to testnet tpub, preserving depth and all metadata.
 */
export function xpubToTpub(xpub: string): string {
  const decoded = decodeBase58Check(xpub);

  // Verify it's an xpub (version 0x0488B21E)
  if (
    decoded[0] !== 0x04 ||
    decoded[1] !== 0x88 ||
    decoded[2] !== 0xb2 ||
    decoded[3] !== 0x1e
  ) {
    throw new Error('Not a valid xpub');
  }

  console.log('Original depth:', decoded[4]);

  // Change version bytes from xpub (0488B21E) to tpub (043587CF)
  decoded[0] = 0x04;
  decoded[1] = 0x35;
  decoded[2] = 0x87;
  decoded[3] = 0xcf;

  return encodeBase58Check(decoded);
}

export function normalizeToTestnetXpub(x: string): string {
  if (x.startsWith('tpub')) return x;
  if (x.startsWith('xpub')) return xpubToTpub(x);
  throw new Error(`Unsupported extended pubkey prefix: ${x.slice(0, 4)}`);
}
