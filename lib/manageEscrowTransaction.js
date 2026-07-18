const crypto = require('crypto');
const db = {
  users: { buyer1: { balance: 1000 }, seller1: { balance: 500 } },
  escrows: {}
};

function manageEscrowTransaction(action, payload = {}) {
  function generateId() {
    return crypto.randomUUID();
  }
  if (action === 'create') {
    const { buyerId, sellerId, amount } = payload;
    if (!buyerId || !sellerId) return { success: false, error: 'Missing buyerId or sellerId' };
    if (!db.users[buyerId]) return { success: false, error: 'Buyer not found' };
    if (!db.users[sellerId]) return { success: false, error: 'Seller not found' };
    if (typeof amount !== 'number' || amount <= 0) return { success: false, error: 'Invalid amount' };
    if (db.users[buyerId].balance < amount) return { success: false, error: 'Insufficient funds' };
    db.users[buyerId].balance -= amount;
    const escrowId = generateId();
    db.escrows[escrowId] = {
      status: 'held',
      amount: amount,
      buyerId: buyerId,
      sellerId: sellerId,
      created: new Date(),
      releaseCondition: payload.releaseCondition || {}
    };
    return { success: true, escrowId: escrowId };
  }
  if (action === 'release') {
    const { escrowId, releaseCondition } = payload;
    if (!escrowId || !db.escrows[escrowId]) return { success: false, error: 'Not found' };
    const escrow = db.escrows[escrowId];
    if (escrow.status !== 'held') return { success: false, error: 'Already released' };
    const cond = releaseCondition || escrow.releaseCondition || {};
    const now = new Date();
    const timeoutDays = cond.timeoutDays || escrow.releaseCondition.timeoutDays;
    if (timeoutDays) {
      const timeoutDate = new Date(escrow.created);
      timeoutDate.setDate(timeoutDate.getDate() + timeoutDays);
      if (now >= timeoutDate) {
        db.users[escrow.sellerId].balance += escrow.amount;
        escrow.status = 'completed';
        return { success: true, escrowId: escrowId };
      }
    }
    if (cond.inspectionPassed && cond.buyerSignoff && cond.sellerSignoff) {
      db.users[escrow.sellerId].balance += escrow.amount;
      escrow.status = 'completed';
      return { success: true, escrowId: escrowId };
    }
    return { success: false, error: 'Release conditions not met' };
  }
  if (action === 'cancel') {
    const { escrowId, buyerId } = payload;
    if (!escrowId || !db.escrows[escrowId]) return { success: false, error: 'Not found' };
    const escrow = db.escrows[escrowId];
    if (escrow.status !== 'held') return { success: false, error: 'Cannot cancel completed escrow' };
    if (escrow.buyerId !== buyerId) return { success: false, error: 'Buyer mismatch' };
    db.users[escrow.buyerId].balance += escrow.amount;
    escrow.status = 'cancelled';
    return { success: true, escrowId: escrowId };
  }
  if (action === 'status') {
    const { escrowId } = payload;
    if (!escrowId || !db.escrows[escrowId]) return { success: false, error: 'Not found' };
    const escrow = db.escrows[escrowId];
    const balance = escrow.status === 'held' ? escrow.amount : 0;
    return { success: true, escrowId: escrowId, balance: balance, status: escrow.status };
  }
  return { success: false, error: 'Invalid action' };
}
module.exports = { manageEscrowTransaction };
