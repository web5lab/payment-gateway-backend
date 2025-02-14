import { successResponse, errorResponse, validationError } from '../utils/response.js';
import * as walletService from '../services/walletService.js';

export const createWallet = async (req, res) => {
  try {
    const { userId, currency, platform } = req.body;
    
    if (!userId || !currency || !platform) {
      return validationError(res, ['Missing required fields: userId, currency, platform']);
    }

    const wallet = await walletService.createWallet({ userId, currency, platform });
    successResponse(res, 201, wallet, 'Wallet created successfully');
  } catch (error) {
    console.error('Wallet creation error:', error);
    errorResponse(res, 400, error.message || 'Failed to create wallet');
  }
};

export const getWallet = async (req, res) => {
  try {
    const wallet = await walletService.getWalletById(req.params.id);
    
    if (!wallet) {
      return errorResponse(res, 404, 'Wallet not found');
    }
    
    successResponse(res, 200, wallet, 'Wallet retrieved successfully');
  } catch (error) {
    console.error('Wallet retrieval error:', error);
    errorResponse(res, 500, 'Failed to retrieve wallet');
  }
};

export const updateWallet = async (req, res) => {
  try {
    const updatedWallet = await walletService.updateWallet(req.params.id, req.body);
    successResponse(res, 200, updatedWallet, 'Wallet updated successfully');
  } catch (error) {
    console.error('Wallet update error:', error);
    errorResponse(res, 400, error.message || 'Failed to update wallet');
  }
};

export const deleteWallet = async (req, res) => {
  try {
    await walletService.deleteWallet(req.params.id);
    successResponse(res, 200, null, 'Wallet deleted successfully');
  } catch (error) {
    console.error('Wallet deletion error:', error);
    errorResponse(res, 400, error.message || 'Failed to delete wallet');
  }
};
