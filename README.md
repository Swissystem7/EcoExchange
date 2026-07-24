# EcoExchange

EcoExchange is a single-file, local-only marketplace concept demo.

It is not an operating marketplace. All 42 listings are fictional
`DEMO_LISTING` fixtures. `LOCAL_DRAFT` is reserved for browser-only user
drafts, while `VERIFIED_MARKETPLACE` is deliberately unavailable. There is no
backend, network integration, account system, verification, public publishing,
messaging, billing, commission collection, trial activation, or sales callback.

Open `index.html` locally. Run the evidence suite with:

```sh
node --test test/local-demo.test.js
```

The tests cover source provenance, absence of network/submission integrations,
local-only persistence language, and lack of fabricated external success.
