const crypto = require('crypto');

function executeEscrowAction(action, params) {
  const escrows = globalThis.__escrows || (globalThis.__escrows = new Map());
  const now = Date.now();
  const validStates = ['PENDING', 'CONFIRMED', 'DISPUTED', 'RELEASED', 'EXPIRED'];

  const getEscrow = (id) => {
    const record = escrows.get(id);
    if (!record) return null;
    return record;
  };

  if (action === 'create') {
    if (!params || typeof params !== 'object') return { success: false, reason: 'invalid params' };
    const { buyerId, sellerId, amount, expiryMs } = params;
    if (buyerId === sellerId) return { success: false, reason: 'buyerId and sellerId must differ' };
    if (!Number.isFinite(amount) || amount <= 0) return { success: false, reason: 'amount must be positive' };
    if (!Number.isFinite(expiryMs) || expiryMs < 0 || expiryMs > 2592000000) return { success: false, reason: 'expiryMs must be between 0 and 30 days' };
    const id = crypto.randomUUID();
    const escrowRecord = {
      id,
      buyerId,
      sellerId,
      amount,
      state: 'PENDING',
      created: now,
      lastUpdated: now,
      expiryMs: now + expiryMs
    };
    escrows.set(id, escrowRecord);
    return { success: true, escrowRecord };
  }

  if (!params || typeof params !== 'object') return { success: false, reason: 'escrowId required' };
  const { escrowId } = params;
  if (!escrowId) return { success: false, reason: 'escrowId required' };
  const record = getEscrow(escrowId);
  if (!record) return { success: false, reason: 'escrow not found' };

  if (action === 'confirm') {
    if (record.state !== 'PENDING' || now > record.expiryMs) return { success: false, reason: 'invalid state' };
    record.state = 'CONFIRMED';
    record.lastUpdated = now;
    return { success: true, escrowRecord: record };
  }

  if (action === 'dispute') {
    if (record.state !== 'CONFIRMED' || now > record.expiryMs) return { success: false, reason: 'invalid state' };
    record.state = 'DISPUTED';
    record.lastUpdated = now;
    record.evidence = params.evidence;
    return { success: true, escrowRecord: record };
  }

  if (action === 'release') {
    if (record.state !== 'DISPUTED') return { success: false, reason: 'invalid state' };
    record.state = params.adminApproval ? 'RELEASED' : 'PENDING';
    record.lastUpdated = now;
    return { success: true, escrowRecord: record };
  }

  if (action === 'expire') {
    if (record.state !== 'PENDING' && record.state !== 'CONFIRMED') return { success: false, reason: 'invalid state' };
    if (now <= record.expiryMs) return { success: false, reason: 'invalid state' };
    record.state = 'EXPIRED';
    record.lastUpdated = now;
    return { success: true, escrowRecord: record };
  }

  return { success: false, reason: 'unknown action' };
}

module.exports = { executeEscrowAction };
