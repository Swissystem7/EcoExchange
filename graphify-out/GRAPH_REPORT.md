# Graph Report - EcoExchange  (2026-07-21)

## Corpus Check
- 39 files · ~9,878 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 140 nodes · 127 edges · 31 communities (24 shown, 7 thin omitted)
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1edaf493`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- findBestMatches.test.js
- factory-ci workflow
- computeListingTrustScore.test.js
- matchBuyerRequests.js
- boostListing.js
- bulkTotal.test.js
- canReleaseEscrow.test.js
- manageEscrowTransaction.js
- matchBestSellers.js
- slugify.test.js
- bundleSuggestions.js
- executeEscrowAction.js
- verifyListingSignature.js
- validate workflow
- EcoExchange README
- EcoExchange — דף אימות שוק (מקסימום 350 מילים)

## God Nodes (most connected - your core abstractions)
1. `EcoExchange — דף אימות שוק (מקסימום 350 מילים)` - 6 edges
2. `matchBuyerRequests()` - 5 edges
3. `factory-ci workflow` - 5 edges
4. `boostListing()` - 4 edges
5. `commission()` - 4 edges
6. `listingScore()` - 4 edges
7. `run` - 4 edges
8. `matchBestSellers()` - 3 edges
9. `getListingById()` - 2 edges
10. `getViewsLast7Days()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `factory-ci workflow` --references--> `commission()`  [INFERRED]
  .github/workflows/factory-ci.yml → lib/commission.js
- `factory-ci workflow` --references--> `listingScore()`  [INFERRED]
  .github/workflows/factory-ci.yml → lib/listingScore.js
- `factory-ci workflow` --references--> `suggestPrice`  [INFERRED]
  .github/workflows/factory-ci.yml → index.html
- `factory-ci workflow` --references--> `findBestMatches`  [INFERRED]
  .github/workflows/factory-ci.yml → index.html
- `factory-ci workflow` --references--> `calculateEscrowFee`  [INFERRED]
  .github/workflows/factory-ci.yml → index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Core Pricing Algorithms** — index_html_suggestprice, index_html_findbestmatches, index_html_calculateescrowfee [EXTRACTED 1.00]

## Communities (31 total, 7 thin omitted)

### Community 0 - "findBestMatches.test.js"
Cohesion: 0.08
Nodes (24): findBestMatches(), assert, { findBestMatches }, result1, result10, result11, result12, result13 (+16 more)

### Community 1 - "factory-ci workflow"
Cohesion: 0.15
Nodes (13): factory-ci workflow, calculateEscrowFee, findBestMatches, listings, run, suggestPrice, commission(), assert (+5 more)

### Community 2 - "computeListingTrustScore.test.js"
Cohesion: 0.15
Nodes (12): computeListingTrustScore(), assert, { computeListingTrustScore }, conditions, expectedScores, result1, result16, result17 (+4 more)

### Community 3 - "matchBuyerRequests.js"
Cohesion: 0.60
Nodes (5): getActiveBuyerRequests(), getListingById(), getPreviousMatchesForListing(), isWithinRadius(), matchBuyerRequests()

### Community 4 - "boostListing.js"
Cohesion: 0.70
Nodes (4): boostListing(), getCategoryDemandPercentile(), getListingById(), getViewsLast7Days()

### Community 5 - "bulkTotal.test.js"
Cohesion: 0.50
Nodes (3): bulkTotal(), assert, { bulkTotal }

### Community 6 - "canReleaseEscrow.test.js"
Cohesion: 0.50
Nodes (3): canReleaseEscrow(), assert, { canReleaseEscrow }

### Community 8 - "matchBestSellers.js"
Cohesion: 0.83
Nodes (3): getAllSellers(), getDistance(), matchBestSellers()

### Community 29 - "EcoExchange — דף אימות שוק (מקסימום 350 מילים)"
Cohesion: 0.25
Nodes (7): 1) ICP מדויק (לקוח ראשון, ישראל), 2) מחיר מוצע + מודל, 3) זווית מול המתחרה המרכזי, 4) תוכנית 100 המשתמשים הראשונים (תקציב 0), 5) קריטריון המשך/פיבוט/הריגה (30 יום), EcoExchange — Market Validation (auto, DeepSeek 2026-07-20), EcoExchange — דף אימות שוק (מקסימום 350 מילים)

## Knowledge Gaps
- **59 isolated node(s):** `assert`, `{ bulkTotal }`, `{ randomUUID }`, `assert`, `{ canReleaseEscrow }` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 5 inferred relationships involving `factory-ci workflow` (e.g. with `calculateEscrowFee` and `findBestMatches`) actually correct?**
  _`factory-ci workflow` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `commission()` (e.g. with `factory-ci workflow` and `commission.js`) actually correct?**
  _`commission()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `assert`, `{ bulkTotal }`, `{ randomUUID }` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `findBestMatches.test.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._