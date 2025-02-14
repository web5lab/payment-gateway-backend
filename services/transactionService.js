import { Connection } from '@solana/web3.js';
import TronWeb from 'tronweb';
import Transaction from '../models/transactionModel.js';

const solanaConnection = new Connection('https://api.mainnet-beta.solana.com');
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: 'default-private-key' // Replace for production
});

export async function getSolanaTransactions(address) {
  return await solanaConnection.getConfirmedSignaturesForAddress2(
    address,
    { limit: 10 }
  );
}

export async function getTronTransactions(address) {
  const result = await tronWeb.trx.getTransactionsRelated(address, 'to', 10);
  return result.data || [];
}

export const createTransaction = async (transactionData) => {
  try {
    const newTransaction = new Transaction({
      amount: transactionData.amount,
      currency: transactionData.currency,
      paymentMethod: transactionData.paymentMethod,
      status: 'pending'
    });
    
    await newTransaction.save();
    return newTransaction;
  } catch (error) {
    throw new Error(`Transaction creation failed: ${error.message}`);
  }
};
