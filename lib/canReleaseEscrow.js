function canReleaseEscrow(escrowState) {
  let { buyerConfirmed, sellerConfirmed, disputeRaised, disputeResolved, escrowAgeHours, autoReleaseHours } = escrowState;
  if (typeof escrowAgeHours !== 'number' || escrowAgeHours < 0) escrowAgeHours = 0;
  if (typeof autoReleaseHours !== 'number' || autoReleaseHours < 0) autoReleaseHours = 72;
  if (typeof disputeResolved !== 'boolean') disputeResolved = null;
  if (disputeRaised) {
    // Dispute takes precedence: release only if explicitly resolved (true); false/null => unresolved.
    if (disputeResolved === true) return { release: true, reason: 'Dispute resolved in buyer favor' };
    return { release: false, reason: 'Dispute unresolved' };
  }
  if (buyerConfirmed && sellerConfirmed) return { release: true, reason: 'Both parties confirmed' };
  if (buyerConfirmed && !disputeRaised && escrowAgeHours >= autoReleaseHours) return { release: true, reason: 'Auto-release after timeout (buyer confirmed)' };
  if (sellerConfirmed && !buyerConfirmed && !disputeRaised && escrowAgeHours >= (autoReleaseHours * 2)) return { release: true, reason: 'Auto-release after extended timeout (seller only)' };
  return { release: false, reason: 'Pending confirmation' };
}
module.exports = { canReleaseEscrow };
