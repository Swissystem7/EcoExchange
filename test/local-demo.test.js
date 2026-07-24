const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('declares provenance classes and labels every fixture', () => {
  for (const source of ['DEMO_LISTING', 'LOCAL_DRAFT', 'VERIFIED_MARKETPLACE']) assert.match(html, new RegExp(source));
  assert.match(html, /sourceClass:SOURCE_CLASSES\.DEMO_LISTING/);
  assert.match(html, /\$\{x\.sourceClass\}/);
});

test('has no network or external form integration', () => {
  for (const forbidden of ['fetch(', 'XMLHttpRequest', 'sendBeacon', '<form', 'type="submit"', 'oauth']) {
    assert.equal(html.toLowerCase().includes(forbidden.toLowerCase()), false, forbidden);
  }
});

test('states local-only behavior and cannot fabricate success', () => {
  assert.match(html, /no real marketplace, publishing, messaging, payments, or accounts/i);
  assert.match(html, /stored only in this browser and never made public/i);
  assert.match(html, /no accounts, contact delivery, sales callback, payment/i);
  assert.match(html, /disabled aria-disabled="true"/);
});
