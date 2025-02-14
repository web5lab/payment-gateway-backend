import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platformId: {
    type: String,
    required: true
  },
  blockchain: {
    type: String,
    required: true,
    enum: ['solana', 'tron', 'ethereum', 'bitcoin']
  },
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true,
    select: false
  },
  address: {
    type: String,
    required: true,
    unique: true
  },
  mnemonic: {
    type: String,
    select: false
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.privateKey;
      delete ret.mnemonic;
      return ret;
    }
  }
});

// Indexes for common query patterns
walletSchema.index({ userId: 1, blockchain: 1 });

export default mongoose.model('Wallet', walletSchema);
