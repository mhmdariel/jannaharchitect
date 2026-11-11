
"use strict";

/*
 * STRIVER ∞
 * Living Mathematical Art and Projective Manifold Exchange
 *
 * PURPOSE
 *   A virtual, non-monetary mathematical-art exchange.
 *   Generates projective-manifold records, symbolic artworks,
 *   consent-checked buyer/seller associations and a live gallery.
 *
 * DEDICATION
 *   Recorded as an intention of service to ﷲ.
 *   Jannatul Firdaus is the hoped-for reward, not a price,
 *   a transaction, an entitlement, or a guaranteed outcome.
 *
 * MATHEMATICAL SCOPE
 *   Each generated object describes a finite-dimensional
 *   real projective space RP^n.
 *   Its cardinality is continuum for n >= 1.
 *   The dimension grows in finite increments until its cap.
 *   The code does not enumerate infinity or materialize
 *   an entire infinite-dimensional manifold.
 *
 * EXCHANGE SCOPE
 *   Participants are simulated.
 *   All associations are virtual and non-monetary.
 *   No legal ownership or real-world sale is created.
 *
 * EXECUTION
 *   node striver-gamma.js
 *   Open http://127.0.0.1:411084
 *
 * Optional:
 *   PORT=8080 node striver-gamma.js
 */

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

// ------------------------------------------------------------
// 1. CONFIGURATION
// ------------------------------------------------------------

const CONFIG = Object.freeze({
  NAME: "STRIVER ∞",
  VERSION: "1.0.0",

  HOST: "127.0.0.1",
  PORT: Number(process.env.PORT || 411084),

  DATA_DIRECTORY: path.join(process.cwd(), "striver-gallery-data"),
  HISTORY_FILE: "mathematical-art-history.jsonl",

  INITIAL_DIMENSION: 64,
  DIMENSION_INCREMENT: 8,
  DIMENSION_INTERVAL: 10,
  MAX_DIMENSION: 100000,

  GAMMA_MAX: Object.freeze({
    MAX_ITERATIONS_PER_SECOND: 10,
    DEFAULT_ITERATIONS_PER_SECOND: 2
  }),

  MAX_RECENT_RECORDS: 100,
  MAX_EXPLICIT_ATLAS_CHARTS: 8,

  DEDICATION: Object.freeze({
    recipient: "ﷲ",
    description: "Intention of sincere service to ﷲ",
    hopedForReward: "Jannatul Firdaus",
    transaction: false,
    purchaseClaim: false,
    guaranteedAcceptance: false,
    monetaryValue: null
  })
});

const intervalRate = Math.min(
  CONFIG.GAMMA_MAX.MAX_ITERATIONS_PER_SECOND,
  Math.max(1, CONFIG.GAMMA_MAX.DEFAULT_ITERATIONS_PER_SECOND)
);

const INTERVAL_MS = 1000 / intervalRate;

// ------------------------------------------------------------
// 2. STORAGE
// ------------------------------------------------------------

fs.mkdirSync(CONFIG.DATA_DIRECTORY, { recursive: true });

const HISTORY_PATH = path.join(
  CONFIG.DATA_DIRECTORY,
  CONFIG.HISTORY_FILE
);

const recentRecords = [];
const clients = new Set();

let sequence = 0;
let running = true;
let totalGenerated = 0;

function loadHistory() {
  if (!fs.existsSync(HISTORY_PATH)) return;

  const content = fs.readFileSync(HISTORY_PATH, "utf8");
  const lines = content.split("\n").filter(Boolean);

  totalGenerated = lines.length;

  for (const line of lines.slice(-CONFIG.MAX_RECENT_RECORDS)) {
    try {
      recentRecords.push(JSON.parse(line));
    } catch {
      // Invalid historical lines are not treated as valid records.
    }
  }

  const last = recentRecords[recentRecords.length - 1];
  if (last && Number.isSafeInteger(last.sequence)) {
    sequence = last.sequence;
  }
}

function persist(record) {
  fs.appendFileSync(
    HISTORY_PATH,
    JSON.stringify(record) + "\n",
    { encoding: "utf8", flag: "a" }
  );
}

// ------------------------------------------------------------
// 3. MATHEMATICAL UTILITIES
// ------------------------------------------------------------

function sha256(value) {
  return crypto
    .createHash("sha256")
    .update(String(value))
    .digest("hex");
}

function deterministicNumber(seed, index) {
  const digest = sha256(`${seed}:${index}`);
  return parseInt(digest.slice(0, 8), 16) / 0xffffffff;
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

// A sparse representative of a projective point.
// This is one sampled point, not a materialized manifold.

function generateProjectivePoint(seed, dimension) {
  const coordinateCount = dimension + 1;
  const coordinates = new Map();

  for (let i = 0; i < 12; i++) {
    const index = Math.floor(
      deterministicNumber(seed, i * 2) * coordinateCount
    );

    const magnitude =
      0.1 + deterministicNumber(seed, i * 2 + 1);

    const sign =
      deterministicNumber(seed, i + 100) >= 0.5 ? 1 : -1;

    coordinates.set(
      index,
      (coordinates.get(index) || 0) + sign * magnitude
    );
  }

  const values = [...coordinates.entries()]
    .filter(([, value]) => Math.abs(value) > 1e-12)
    .sort((a, b) => a[0] - b[0]);

  const norm = Math.sqrt(
    values.reduce((sum, [, value]) => sum + value * value, 0)
  );

  if (norm === 0) {
    values.push([0, 1]);
  }

  const divisor = norm || 1;

  let normalized = values.map(([index, value]) => [
    index,
    value / divisor
  ]);

  // Canonicalize the sign of the representative:
  // [x] and [-x] represent the same projective point.
  if (normalized[0] && normalized[0][1] < 0) {
    normalized = normalized.map(([index, value]) => [
      index,
      -value
    ]);
  }

  return {
    representation: "SPARSE_NORMALIZED_PROJECTIVE_POINT",
    ambientVectorDimension: coordinateCount,
    nonzeroCoordinates: normalized.length,
    coordinates: normalized.map(([index, value]) => ({
      index,
      value: Number(value.toFixed(8))
    }))
  };
}

// ------------------------------------------------------------
// 4. PROJECTIVE MANIFOLD GENERATOR
// ------------------------------------------------------------

class GammaMaxManifoldGenerator {
  cardinality(dimension) {
    if (dimension === 0) {
      return {
        description: "Singleton",
        symbol: "1"
      };
    }

    return {
      description: "Continuum",
      symbol: "2^ALEPH_0"
    };
  }

  orientability(dimension) {
    // RP^n is orientable exactly when n is odd,
    // with RP^0 also orientable.
    return dimension === 0 || dimension % 2 === 1
      ? "ORIENTABLE"
      : "NON_ORIENTABLE";
  }

  generateAtlas(dimension) {
    const totalCharts = dimension + 1;

    const explicitCount = Math.min(
      totalCharts,
      CONFIG.MAX_EXPLICIT_ATLAS_CHARTS
    );

    const charts = [];

    for (let i = 0; i < explicitCount; i++) {
      charts.push({
        chart: `U_${i}`,
        domain: `x_${i} != 0`,
        localCoordinates: `u_j = x_j / x_${i}`,
        coordinateDimension: dimension
      });
    }

    return {
      totalStandardCharts: totalCharts,
      explicitlyDescribedCharts: charts.length,
      remainingChartsDescribedSymbolically:
        totalCharts - charts.length,
      charts,
      transitionRule:
        "On U_i intersect U_k: u'_j = u_j / u_k",
      transitionDomain:
        "The overlap where both chart denominators are nonzero",
      atlasMaterialization:
        "PARTIAL_SYMBOLIC_DESCRIPTION"
    };
  }

  generate(sequenceNumber, dimension) {
    const seed = `STRIVER-MANIFOLD-${sequenceNumber}`;

    const point = generateProjectivePoint(
      seed,
      dimension
    );

    const identity = sha256(
      JSON.stringify({
        sequenceNumber,
        dimension,
        point
      })
    );

    return {
      id: `MANIFOLD-${sequenceNumber}`,
      identity,

      mathematicalObject: "REAL_PROJECTIVE_SPACE",
      notation: `RP^${dimension}`,
      dimension,

      construction:
        "R^(n+1) minus the origin, modulo nonzero scalar equivalence",

      equivalenceRelation:
        "[x] = [lambda*x], lambda != 0",

      cardinality: this.cardinality(dimension),

      topology: {
        compact: true,
        connected: true,
        smooth: true,
        boundary: false,
        orientability: this.orientability(dimension)
      },

      atlas: this.generateAtlas(dimension),

      sampledPoint: point,

      interpretation:
        "Finite-dimensional projective manifold specification " +
        "with one sparse representative point",

      materialization:
        "SYMBOLIC_SPECIFICATION_NOT_FULL_MANIFOLD",

      dedication: CONFIG.DEDICATION
    };
  }
}

// ------------------------------------------------------------
// 5. SYMBOLIC ART GENERATOR
// ------------------------------------------------------------

const ART_THEMES = [
  "Continuity",
  "Symmetry",
  "Convergence",
  "Projective Harmony",
  "Geometric Balance",
  "Mathematical Peace",
  "Infinite Possibility",
  "Truthful Cultural Progress",
  "Topological Unity",
  "Light and Structure"
];

function generateArtwork(sequenceNumber, manifold) {
  const themeIndex = Math.floor(
    deterministicNumber(
      `ART-${sequenceNumber}`,
      1
    ) * ART_THEMES.length
  );

  const theme = ART_THEMES[themeIndex];

  const palette = [
    "#ffffff",
    "#d9f99d",
    "#86efac",
    "#22c55e",
    "#facc15",
    "#a7f3d0"
  ];

  const paletteIndex = Math.floor(
    deterministicNumber(
      `PALETTE-${sequenceNumber}`,
      2
    ) * palette.length
  );

  const artwork = {
    id: `ART-${sequenceNumber}`,
    title: `${theme} — ${manifold.notation}`,
    theme,
    visualStyle: "PROJECTIVE_GEOMETRIC_ABSTRACTION",
    palette: palette[paletteIndex],
    manifoldId: manifold.id,
    manifoldIdentity: manifold.identity,

    artisticStatement:
      "A symbolic exploration of mathematical structure, " +
      "continuity and truthful cultural progress.",

    monetaryPrice: null,
    financialInstrument: false,
    legalOwnershipTransfer: false,

    createdAt: new Date().toISOString()
  };

  artwork.identity = sha256(JSON.stringify(artwork));

  return artwork;
}

// ------------------------------------------------------------
// 6. SIMULATED PARTICIPANTS AND CONSENT
// ------------------------------------------------------------

function generateParticipants(sequenceNumber) {
  return {
    seller: {
      id: `SIMULATED-SELLER-${sequenceNumber}`,
      role: "SELLER",
      simulated: true,
      consentToPublish: true,
      consentToVirtualAssociation: true
    },

    buyer: {
      id: `SIMULATED-BUYER-${sequenceNumber}`,
      role: "BUYER",
      simulated: true,
      interestInManifolds: true,
      consentToReceiveOffer: true,
      consentToVirtualAssociation: true
    }
  };
}

// These are deliberately simulated consent values.
// They do not represent real people or actual consent.

function validateConsent(buyer, seller) {
  if (!buyer || !seller) {
    return {
      accepted: false,
      reason: "MISSING_PARTICIPANT"
    };
  }

  if (!buyer.simulated || !seller.simulated) {
    return {
      accepted: false,
      reason: "REAL_PARTICIPANT_REQUIRES_AUTHENTICATED_CONSENT"
    };
  }

  if (
    buyer.role !== "BUYER" ||
    seller.role !== "SELLER"
  ) {
    return {
      accepted: false,
      reason: "ROLE_VALIDATION_FAILED"
    };
  }

  if (!buyer.interestInManifolds) {
    return {
      accepted: false,
      reason: "NO_BUYER_INTEREST"
    };
  }

  if (
    !buyer.consentToReceiveOffer ||
    !buyer.consentToVirtualAssociation ||
    !seller.consentToPublish ||
    !seller.consentToVirtualAssociation
  ) {
    return {
      accepted: false,
      reason: "CONSENT_NOT_ESTABLISHED"
    };
  }

  return {
    accepted: true,
    reason: "SIMULATED_CONSENT_VALIDATED"
  };
}

// ------------------------------------------------------------
// 7. VIRTUAL MANIFOLD EXCHANGE
// ------------------------------------------------------------

class ManifoldExchangeRegistry {
  constructor() {
    this.associations = [];
  }

  exchange(manifold, artwork, buyer, seller) {
    const consent = validateConsent(buyer, seller);

    if (!consent.accepted) {
      return {
        status: "REJECTED",
        reason: consent.reason
      };
    }

    const association = {
      id: `ASSOCIATION-${this.associations.length + 1}`,

      manifoldId: manifold.id,
      artworkId: artwork.id,

      buyerId: buyer.id,
      sellerId: seller.id,

      status: "VIRTUAL_ASSOCIATION_CREATED",

      monetaryTransfer: false,
      legalSale: false,
      ownershipTransfer: false,

      consent: consent.reason,

      createdAt: new Date().toISOString()
    };

    association.identity = sha256(
      JSON.stringify(association)
    );

    this.associations.push(association);

    return association;
  }

  statistics() {
    return {
      totalVirtualAssociations: this.associations.length,
      monetaryTransactions: 0,
      legalSales: 0,
      ownershipTransfers: 0
    };
  }
}

// ------------------------------------------------------------
// 8. CULTURAL PROGRESS SIGNAL
// ------------------------------------------------------------

function generateCulturalSignal(
  sequenceNumber,
  manifold,
  artwork
) {
  return {
    id: `CULTURAL-SIGNAL-${sequenceNumber}`,

    signalType: "TRUTHFUL_MATHEMATICAL_CULTURAL_PROGRESS",

    sequence: sequenceNumber,

    theme: artwork.theme,

    manifold: manifold.notation,

    dimension: manifold.dimension,

    cardinality: manifold.cardinality.symbol,

    evidence: [
      "A mathematical specification was generated",
      "A sparse projective representative was recorded",
      "An artwork record was created",
      "A symbolic exchange was evaluated"
    ],

    unsupportedClaims: [],

    interpretation:
      "This signal reports software-generated activity only. " +
      "It does not claim independent social impact or external adoption.",

    createdAt: new Date().toISOString()
  };
}

// ------------------------------------------------------------
// 9. MAIN STRIVER ENGINE
// ------------------------------------------------------------

class Striver {
  constructor() {
    this.manifoldGenerator =
      new GammaMaxManifoldGenerator();

    this.exchangeRegistry =
      new ManifoldExchangeRegistry();
  }

  currentDimension(sequenceNumber) {
    const growthSteps = Math.floor(
      Math.max(0, sequenceNumber - 1) /
      CONFIG.DIMENSION_INTERVAL
    );

    return Math.min(
      CONFIG.MAX_DIMENSION,
      CONFIG.INITIAL_DIMENSION +
        growthSteps * CONFIG.DIMENSION_INCREMENT
    );
  }

  executeIteration() {
    sequence++;

    const dimension = this.currentDimension(sequence);

    const manifold = this.manifoldGenerator.generate(
      sequence,
      dimension
    );

    const artwork = generateArtwork(
      sequence,
      manifold
    );

    const participants = generateParticipants(sequence);

    const association = this.exchangeRegistry.exchange(
      manifold,
      artwork,
      participants.buyer,
      participants.seller
    );

    const culturalSignal = generateCulturalSignal(
      sequence,
      manifold,
      artwork
    );

    const record = {
      platform: CONFIG.NAME,
      version: CONFIG.VERSION,

      sequence,
      createdAt: new Date().toISOString(),

      dimension,

      manifold,
      artwork,

      association,

      culturalSignal,

      participants: {
        buyer: participants.buyer.id,
        seller: participants.seller.id,
        bothSimulated: true
      },

      dedication: CONFIG.DEDICATION,

      financialActivity: {
        securities: false,
        currencyTrading: false,
        moneyTransferred: false,
        interestCharged: false,
        monetaryPrice: null
      }
    };

    record.recordIdentity = sha256(
      JSON.stringify(record)
    );

    // Append-only by application convention.
    // This is not cryptographic tamper-proof storage.
    persist(record);

    recentRecords.push(record);

    if (recentRecords.length > CONFIG.MAX_RECENT_RECORDS) {
      recentRecords.shift();
    }

    totalGenerated++;

    broadcast({
      type: "NEW_RECORD",
      record,
      statistics: this.statistics()
    });

    return record;
  }

  statistics() {
    return {
      platform: CONFIG.NAME,
      version: CONFIG.VERSION,

      running,

      totalGenerated,

      currentSequence: sequence,

      currentDimension:
        this.currentDimension(sequence),

      maximumDimension:
        CONFIG.MAX_DIMENSION,

      configuredMaximumRate:
        CONFIG.GAMMA_MAX.MAX_ITERATIONS_PER_SECOND,

      configuredRate:
        intervalRate,

      exchange:
        this.exchangeRegistry.statistics(),

      financialTransactions: 0,

      storage: CONFIG.HISTORY_FILE
    };
  }
}

// ------------------------------------------------------------
// 10. LIVE EVENT STREAM
// ------------------------------------------------------------

function broadcast(payload) {
  const message =
    `data: ${JSON.stringify(payload)}\n\n`;

  for (const client of clients) {
    try {
      client.write(message);
    } catch {
      clients.delete(client);
    }
  }
}

// ------------------------------------------------------------
// 11. BROWSER GALLERY
// ------------------------------------------------------------

const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>STRIVER ∞ — Mathematical Art Gallery</title>

<style>
:root {
  color-scheme: dark;
  --background: #080c0a;
  --panel: #101914;
  --green: #86efac;
  --gold: #facc15;
  --muted: #a3b3a8;
  --border: #263b2e;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--background);
  color: #f4fff6;
  font-family: system-ui, sans-serif;
}

header {
  padding: 32px 20px;
  text-align: center;
  border-bottom: 1px solid var(--border);
  background: radial-gradient(ellipse at top, #193323, #080c0a 72%);
}

h1 {
  color: var(--green);
  letter-spacing: .08em;
  margin: 0;
  font-size: clamp(2rem, 7vw, 4rem);
}

.subtitle {
  color: var(--muted);
  margin-top: 10px;
}

.dedication {
  color: var(--gold);
  margin-top: 18px;
}

main {
  max-width: 1250px;
  margin: auto;
  padding: 24px 16px 70px;
}

.status {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
}

button {
  background: #183c27;
  color: white;
  border: 1px solid #3f8055;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

button:hover { background: #245b37; }

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(150px,1fr));
  gap: 12px;
  margin: 20px 0;
}

.metric {
  padding: 16px;
  border: 1px solid var(--border);
  background: var(--panel);
  border-radius: 10px;
}

.metric strong {
  display: block;
  font-size: 1.5rem;
  color: var(--green);
  overflow-wrap: anywhere;
}

.metric span {
  color: var(--muted);
  font-size: .85rem;
}

h2 {
  color: var(--green);
  margin-top: 34px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
  gap: 16px;
}

.card {
  border: 1px solid var(--border);
  background: var(--panel);
  border-radius: 12px;
  overflow: hidden;
}

.art {
  height: 175px;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle, #1d5030, #09100c 75%);
}

.art::before,
.art::after {
  content: "";
  position: absolute;
  border: 2px solid var(--art-color, #86efac);
  border-radius: 50%;
  width: 130px;
  height: 130px;
  transform: rotate(35deg) scaleX(.55);
}

.art::after {
  transform: rotate(-35deg) scaleX(.55);
}

.art span {
  position: relative;
  z-index: 1;
  color: white;
  font-size: 2rem;
  text-shadow: 0 0 16px #000;
}

.card-body { padding: 16px; }

.card h3 {
  color: var(--green);
  margin: 0 0 10px;
}

.card p {
  color: var(--muted);
  font-size: .9rem;
  overflow-wrap: anywhere;
}

small {
  color: var(--muted);
  overflow-wrap: anywhere;
}

.tag {
  display: inline-block;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 4px 8px;
  margin: 3px 3px 3px 0;
  font-size: .75rem;
  color: var(--gold);
}

.notice {
  border-left: 3px solid var(--gold);
  padding: 12px 16px;
  background: #15170f;
  color: var(--muted);
  line-height: 1.6;
  margin-top: 26px;
}

#connection { color: var(--green); }

footer {
  text-align: center;
  color: var(--muted);
  padding: 30px;
  border-top: 1px solid var(--border);
}
</style>
</head>

<body>
<header>
  <h1>STRIVER ∞</h1>
  <div class="subtitle">
    Living Mathematical Art · Projective Manifold Exchange
  </div>
  <div class="dedication">ﷲ — Intention of service</div>
</header>

<main>

  <section class="status">
    <div>
      <strong>Gallery status:</strong>
      <span id="connection">Connecting...</span>
    </div>

    <div>
      <button id="pause">Pause generation</button>
      <button id="resume">Resume generation</button>
    </div>
  </section>

  <section class="metrics">
    <div class="metric">
      <strong id="total">0</strong>
      <span>Generated records</span>
    </div>

    <div class="metric">
      <strong id="dimension">64</strong>
      <span>Current manifold dimension</span>
    </div>

    <div class="metric">
      <strong id="associations">0</strong>
      <span>Virtual associations</span>
    </div>

    <div class="metric">
      <strong>2^ALEPH_0</strong>
      <span>Cardinality for RPⁿ, n ≥ 1</span>
    </div>
  </section>

  <h2>Live mathematical art gallery</h2>

  <div class="gallery" id="gallery"></div>

  <div class="notice">
    <strong>Mathematical precision:</strong>
    Each card describes a finite-dimensional real projective
    space and one sparse representative point. The atlas is
    described symbolically; the entire manifold is not
    computationally materialized.
  </div>

  <div class="notice">
    <strong>Exchange integrity:</strong>
    Buyer and seller are simulated participants. The exchange
    creates non-monetary symbolic associations only. It does
    not create real buyers, legal ownership, or financial sales.
  </div>

  <div class="notice">
    <strong>Dedication:</strong>
    Jannatul Firdaus is recorded as a hoped-for reward.
    No software can establish divine acceptance, assign a
    price to Paradise, or guarantee a purchase by ﷲ.
  </div>

</main>

<footer>
  STRIVER ∞ · Mathematical art history · Truthful cultural signals
</footer>

<script>
"use strict";

const gallery = document.getElementById("gallery");
const connection = document.getElementById("connection");

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function renderRecord(record) {
  const card = element("article", undefined, "card");

  const art = element("div", undefined, "art");
  art.style.setProperty(
    "--art-color",
    record.artwork.palette
  );

  art.appendChild(
    element("span", "∞")
  );

  const body = element("div", undefined, "card-body");

  body.appendChild(
    element("h3", record.artwork.title)
  );

  body.appendChild(
    element("p", record.artwork.artisticStatement)
  );

  const tags = element("div");

  [
    record.manifold.notation,
    "Dimension " + record.dimension,
    record.manifold.cardinality.symbol,
    record.association.status
  ].forEach(value => {
    tags.appendChild(element("span", value, "tag"));
  });

  body.appendChild(tags);

  body.appendChild(
    element(
      "p",
      "Theme: " + record.artwork.theme
    )
  );

  body.appendChild(
    element(
      "small",
      "Record " + record.sequence +
      " · " + new Date(record.createdAt).toLocaleString()
    )
  );

  body.appendChild(
    element(
      "p",
      "Identity: " + record.recordIdentity.slice(0, 24) + "..."
    )
  );

  card.appendChild(art);
  card.appendChild(body);

  gallery.prepend(card);

  while (gallery.children.length > 60) {
    gallery.removeChild(gallery.lastChild);
  }
}

function updateStatistics(stats) {
  document.getElementById("total").textContent =
    stats.totalGenerated;

  document.getElementById("dimension").textContent =
    stats.currentDimension;

  document.getElementById("associations").textContent =
    stats.exchange.totalVirtualAssociations;
}

async function loadInitialState() {
  const response = await fetch("/api/state");
  const state = await response.json();

  updateStatistics(state.statistics);

  gallery.replaceChildren();

  state.records.forEach(renderRecord);
}

async function control(action) {
  await fetch("/api/" + action, { method: "POST" });
}

document.getElementById("pause").addEventListener(
  "click",
  () => control("pause")
);

document.getElementById("resume").addEventListener(
  "click",
  () => control("resume")
);

async function connect() {
  try {
    await loadInitialState();

    const stream = new EventSource("/api/events");

    stream.onopen = () => {
      connection.textContent = "LIVE";
    };

    stream.onerror = () => {
      connection.textContent = "Reconnecting...";
    };

    stream.onmessage = event => {
      const message = JSON.parse(event.data);

      if (message.type === "NEW_RECORD") {
        renderRecord(message.record);
        updateStatistics(message.statistics);
      }

      if (message.type === "STATUS") {
        updateStatistics(message.statistics);
      }
    };

  } catch (error) {
    connection.textContent = "Connection unavailable";
    console.error(error);
  }
}

connect();
</script>
</body>
</html>`;

// ------------------------------------------------------------
// 12. HTTP SERVER AND API
// ------------------------------------------------------------

const striver = new Striver();

function sendJSON(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });

  response.end(JSON.stringify(data));
}

const server = http.createServer((request, response) => {
  const url = new URL(
    request.url,
    `http://${CONFIG.HOST}:${CONFIG.PORT}`
  );

  if (request.method === "GET" && url.pathname === "/") {
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });

    response.end(HTML);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/state") {
    sendJSON(response, 200, {
      statistics: striver.statistics(),
      records: [...recentRecords].reverse()
    });

    return;
  }

  if (request.method === "GET" && url.pathname === "/api/events") {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });

    response.write(
      `data: ${JSON.stringify({
        type: "STATUS",
        statistics: striver.statistics()
      })}\n\n`
    );

    clients.add(response);

    request.on("close", () => {
      clients.delete(response);
    });

    return;
  }

  if (request.method === "POST" && url.pathname === "/api/pause") {
    running = false;

    broadcast({
      type: "STATUS",
      statistics: striver.statistics()
    });

    sendJSON(response, 200, {
      success: true,
      running
    });

    return;
  }

  if (request.method === "POST" && url.pathname === "/api/resume") {
    running = true;

    broadcast({
      type: "STATUS",
      statistics: striver.statistics()
    });

    sendJSON(response, 200, {
      success: true,
      running
    });

    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJSON(response, 200, {
      status: "OK",
      statistics: striver.statistics()
    });

    return;
  }

  sendJSON(response, 404, {
    error: "NOT_FOUND"
  });
});

// ------------------------------------------------------------
// 13. SELF-EXECUTING GAMMA-MAX SCHEDULER
// ------------------------------------------------------------

function startGeneration() {
  setInterval(() => {
    if (!running) return;

    try {
      striver.executeIteration();
    } catch (error) {
      console.error(
        "[STRIVER GENERATION ERROR]",
        error
      );
    }
  }, INTERVAL_MS);
}

// ------------------------------------------------------------
// 14. STARTUP
// ------------------------------------------------------------

function start() {
  loadHistory();

  server.listen(CONFIG.PORT, CONFIG.HOST, () => {
    console.log("");
    console.log("======================================");
    console.log(" STRIVER ∞ — RUNNING");
    console.log("======================================");
    console.log("Gallery:");
    console.log(
      `http://${CONFIG.HOST}:${CONFIG.PORT}`
    );
    console.log("");
    console.log("Generation rate:", intervalRate, "per second");
    console.log("Maximum configured rate:",
      CONFIG.GAMMA_MAX.MAX_ITERATIONS_PER_SECOND,
      "per second"
    );
    console.log("Initial dimension:", CONFIG.INITIAL_DIMENSION);
    console.log("Maximum dimension:", CONFIG.MAX_DIMENSION);
    console.log("Storage:", HISTORY_PATH);
    console.log("Exchange: VIRTUAL AND NON-MONETARY");
    console.log("Participants: SIMULATED");
    console.log("Financial trading: DISABLED");
    console.log("Dedication: INTENTION OF SERVICE TO ﷲ");
    console.log("======================================");
    console.log("");

    startGeneration();
  });
}

process.on("SIGINT", () => {
  console.log("\nStopping STRIVER ∞...");

  running = false;

  for (const client of clients) {
    client.end();
  }

  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});

start();
