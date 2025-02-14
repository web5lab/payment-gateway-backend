import { getSolanaTransactions, getTronTransactions } from '../services/transactionService.js';
import { successResponse, errorResponse, validationError } from '../utils/response.js';

export const getTransactions = async (req, res) => {
  const { userId, platformId } = req.query;

  if (!userId || !platformId) {
    return validationError(res, ['userId and platformId are required']);
  }

  try {
    const wallet = wallets.find(w => 
      w.userId === userId && w.platformId === platformId
    );

    if (!wallet) {
      return errorResponse(res, 'Wallet not found', 404);
    }

    let transactions;
    if (platformId.toLowerCase() === 'solana') {
      transactions = await getSolanaTransactions(wallet.address);
    } else if (platformId.toLowerCase() === 'tron') {
      transactions = await getTronTransactions(wallet.address);
    }

    successResponse(res, {
      userId,
      platformId,
      address: wallet.address,
      transactions: transactions || []
    });
  } catch (error) {
    console.error('Transaction monitoring failed:', error);
    errorResponse(res, 'Failed to fetch transactions');
  }
};
