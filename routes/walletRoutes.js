import express from 'express';
import {
  createWallet,
  getWallet,
  updateWallet,
  deleteWallet
} from '../controllers/walletController.js';

const router = express.Router();

router.post('/', createWallet);
router.get('/:id', getWallet);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);

export default router;
