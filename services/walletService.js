import { Keypair } from '@solana/web3.js';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import tron_pkg from 'tron-format-address';
const { toBase58 } = tron_pkg;
import pkg from 'elliptic';
const { ec } = pkg;
import Wallet from '../models/walletModel.js';

export async function createSolanaWallet(userId, platformId) {
  try {
    const keypair = Keypair.generate();
    const wallet = await Wallet.create({
      userId,
      platformId,
      blockchain: 'solana',
      publicKey: keypair.publicKey.toString(),
      privateKey: keypair.secretKey.toString(),
      address: keypair.publicKey.toString(),
      status: 'active'
    });
    return wallet;
  } catch (error) {
    throw new Error(`Solana wallet creation failed: ${error.message}`);
  }
}

export async function createTronWallet(userId, platformId) {
  try {
    const mnemonic = generateMnemonic(256);
    const seed = mnemonicToSeedSync(mnemonic);
    const privateKey = seed.slice(0, 32).toString('hex');
    
    const ecdsa = new ec('secp256k1');
    const keyPair = ecdsa.keyFromPrivate(privateKey, 'hex');
    const publicKey = keyPair.getPublic('hex').slice(2);
    
    const address = toBase58(Buffer.from(publicKey, 'hex'));
    
    const wallet = await Wallet.create({
      userId,
      platformId,
      blockchain: 'tron',
      publicKey: `0x${publicKey}`,
      privateKey: `0x${privateKey}`,
      address: address,
      mnemonic: mnemonic,
      status: 'active'
    });
    
    return wallet;
  } catch (error) {
    throw new Error(`Tron wallet creation failed: ${error.message}`);
  }
}

export async function getWalletById(id) {
  try {
    return await Wallet.findById(id);
  } catch (error) {
    throw new Error(`Wallet lookup failed: ${error.message}`);
  }
}

export async function updateWallet(id, updateData) {
  try {
    return await Wallet.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  } catch (error) {
    throw new Error(`Wallet update failed: ${error.message}`);
  }
}

export async function deleteWallet(id) {
  try {
    return await Wallet.findByIdAndUpdate(
      id,
      { $set: { status: 'deleted', deletedAt: new Date() } },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Wallet deletion failed: ${error.message}`);
  }
}
