import { describe, expect, it } from "vitest";
import * as tool0 from "../statistics/chi-square-independence/index.js";
import * as tool1 from "../statistics/kendall-tau/index.js";
import * as tool2 from "../statistics/spearman-rank-correlation/index.js";
import * as tool3 from "../random/chinese-postman-instance/index.js";
import * as tool4 from "../random/clique-instance/index.js";
import * as tool5 from "../random/constraint-satisfaction-instance/index.js";
import * as tool6 from "../random/cutting-stock-instance/index.js";
import * as tool7 from "../random/eulerian-circuit-test-case/index.js";
import * as tool8 from "../random/flow-shop-scheduling-instance/index.js";
import * as tool9 from "../random/hamiltonian-cycle-instance/index.js";
import * as tool10 from "../random/independent-set-instance/index.js";
import * as tool11 from "../random/itemset-instance/index.js";
import * as tool12 from "../random/job-shop-scheduling-instance/index.js";
import * as tool13 from "../random/knapsack-instance/index.js";
import * as tool14 from "../random/max-sat-instance/index.js";
import * as tool15 from "../random/maximum-flow-instance/index.js";
import * as tool16 from "../random/min-cost-flow-instance/index.js";
import * as tool17 from "../random/minimum-spanning-tree-test-case/index.js";
import * as tool18 from "../random/monte-carlo-pi/index.js";
import * as tool19 from "../random/multiprocessor-scheduling-instance/index.js";
import * as tool20 from "../random/set-covering-instance/index.js";
import * as tool21 from "../random/set-partitioning-instance/index.js";
import * as tool22 from "../random/shortest-path-test-case/index.js";
import * as tool23 from "../random/strip-packing-instance/index.js";
import * as tool24 from "../random/traveling-salesman-instance/index.js";
import * as tool25 from "../random/traveling-salesman-time-windows-instance/index.js";
import * as tool26 from "../random/variable-size-bin-packing-instance/index.js";
import * as tool27 from "../random/vehicle-routing-instance/index.js";
import * as tool28 from "../random/vertex-cover-instance/index.js";
import * as tool29 from "../data-mining/fp-growth/index.js";
import * as tool30 from "../date/calendar-overlap-gaps/index.js";
import * as tool31 from "../statistics/kernel-density-estimator/index.js";
import * as tool32 from "../statistics/kurtosis/index.js";
import * as tool33 from "../statistics/mean-absolute-deviation-from-median/index.js";
import * as tool34 from "../statistics/median-absolute-deviation/index.js";
import * as tool35 from "../random/monte-carlo-integration/index.js";
import * as tool36 from "../statistics/principal-component-analysis/index.js";
import * as tool37 from "../data-mining/rough-set-approximations/index.js";
import * as tool38 from "../finance/salary-comparison/index.js";
import * as tool39 from "../data-mining/sequential-pattern-mining/index.js";
import * as tool40 from "../probability/gaussian-mixture-sampler/index.js";
import * as tool41 from "../random/monte-carlo-random-walk/index.js";
import * as tool42 from "../random/monte-carlo-uniform/index.js";
import * as tool43 from "../random/graph-coloring-instance/index.js";
import * as tool44 from "../data-structure/cuckoo-hash-trace/index.js";
import * as tool45 from "../graph/strongly-connected-components/index.js";
import * as tool46 from "../algebra/solve-linear-system/index.js";
import * as tool47 from "../text/unified-diff/index.js";
import * as tool48 from "../random/color-wheel/index.js";
import * as tool49 from "../random/contrast-constrained-palette/index.js";
import * as tool50 from "../random/perceptually-distinct-palette/index.js";
import * as tool51 from "../random/color-vision-deficiency-palette/index.js";
import * as tool52 from "../random/categorical-color-palette/index.js";
import * as tool53 from "../random/ui-theme-color-set/index.js";
import * as tool54 from "../random/mesh-color-pattern/index.js";
import * as tool55 from "../random/multicolor-plaid-pattern/index.js";
import * as tool56 from "../random/geometric-color-pattern/index.js";
import * as tool57 from "../random/food-by-nutrient/index.js";
import * as tool58 from "../random/scale-melody/index.js";
import * as tool59 from "../random/interval-melody/index.js";
import * as tool60 from "../random/rhythm-measure/index.js";
import * as tool61 from "../random/drum-pattern/index.js";
import * as tool62 from "../random/positive-definite-matrix/index.js";
import * as tool63 from "../random/orthogonal-matrix/index.js";
import * as tool64 from "../random/connected-graph-test-case/index.js";
import * as tool65 from "../random/dag-topology-test-case/index.js";
import * as tool66 from "../random/csv-table/index.js";
import * as tool67 from "../random/nested-json-document/index.js";
import * as tool68 from "../random/json-patch-test-case/index.js";
import * as tool69 from "../random/time-series/index.js";
import * as tool70 from "../random/correlated-point-dataset/index.js";
import * as tool71 from "../random/outlier-detection-test-case/index.js";
import * as tool72 from "../random/clustered-point-dataset/index.js";
import * as tool73 from "../random/missing-value-table/index.js";
import * as tool74 from "../random/ipv4-cidr-block-set/index.js";
import * as tool75 from "../random/calendar-event-set/index.js";
import * as tool76 from "../random/recurrence-schedule/index.js";
import * as tool77 from "../random/word-search-puzzle/index.js";
import * as tool78 from "../random/css-keyframe-motion/index.js";
import * as tool79 from "../random/identicon/index.js";
import * as tool80 from "../random/pixel-art-tile/index.js";
import * as tool81 from "../random/svg-constellation-pattern/index.js";
import * as tool82 from "../random/terrain-profile/index.js";
import * as tool83 from "../random/bingo-card/index.js";
import * as tool84 from "../random/tournament-bracket/index.js";
import * as tool85 from "../random/round-robin-schedule/index.js";
import * as tool86 from "../random/overdispersed-count-experiment/index.js";
import * as tool87 from "../random/heavy-tail-comparison-experiment/index.js";
import * as tool88 from "../random/mixture-distribution-experiment/index.js";
import * as tool89 from "../random/bootstrap-interval-experiment/index.js";
import * as tool90 from "../random/ab-test-experiment/index.js";
import * as tool91 from "../random/paired-t-test-test-case/index.js";
import * as tool92 from "../random/anova-test-case/index.js";
import * as tool93 from "../random/rank-sum-test-case/index.js";
import * as tool94 from "../random/confidence-interval-coverage-experiment/index.js";
import * as tool95 from "../random/linear-regression-noise-benchmark/index.js";
import * as tool96 from "../random/multiple-testing-test-case/index.js";
import * as tool97 from "../random/boolean-formula-cnf-exercise/index.js";
import * as tool98 from "../random/bloom-filter-workload/index.js";
import * as tool99 from "../random/counting-bloom-filter-workload/index.js";
import * as tool100 from "../random/cardinality-sketch-workload/index.js";
import * as tool101 from "../random/minhash-similarity-workload/index.js";
import * as tool102 from "../random/lsh-candidate-workload/index.js";
import * as tool103 from "../random/string-distance-matrix/index.js";
import * as tool104 from "../random/solvable-maze-test-case/index.js";
import * as tool105 from "../random/minimax-game-tree-test-case/index.js";
import * as tool106 from "../random/ridge-regression-benchmark/index.js";
import * as tool107 from "../random/polynomial-regression-benchmark/index.js";
import * as tool108 from "../random/feedforward-network-test-case/index.js";
import * as tool109 from "../random/attention-matrix-test-case/index.js";
import * as tool110 from "../random/payoff-matrix-game/index.js";
import * as tool111 from "../random/geodesic-route-set/index.js";
import * as tool112 from "../random/debounce-signal-test-case/index.js";
import * as tool113 from "../random/http-cookie-round-trip-corpus/index.js";
import * as tool114 from "../random/http-set-cookie-attribute-corpus/index.js";
import * as tool115 from "../random/html-attribute-quoting-corpus/index.js";
import * as tool116 from "../random/html-text-extraction-corpus/index.js";
import * as tool117 from "../random/csv-quoting-edge-case-corpus/index.js";
import * as tool118 from "../random/csv-pivot-practice-dataset/index.js";
import * as tool119 from "../random/json-pointer-navigation-exercise/index.js";
import * as tool120 from "../random/json-flattening-round-trip-corpus/index.js";
import * as tool121 from "../random/text-encoding-detection-practice-cards/index.js";
import * as tool122 from "../random/barcode-label-sheet/index.js";
import * as tool123 from "../random/qr-message-card-set/index.js";
import * as tool124 from "../random/upc-compression-round-trip-corpus/index.js";
import * as tool125 from "../random/identifier-transcription-error-corpus/index.js";
import * as tool126 from "../random/sqids-reversible-id-fixture/index.js";
import * as tool127 from "../random/palindrome-construction-puzzle/index.js";
import * as tool128 from "../random/word-wrap-boundary-corpus/index.js";
import * as tool129 from "../random/cloze-practice-packet/index.js";
import * as tool130 from "../random/fair-classroom-calling-sequence/index.js";
import * as tool131 from "../random/jigsaw-learning-assignment/index.js";
import * as tool132 from "../random/differentiated-activity-assignment/index.js";
import * as tool133 from "../random/assessment-item-sampler/index.js";
import * as tool134 from "../random/faded-solution-practice-packet/index.js";
import * as tool135 from "../random/classroom-station-rotation/index.js";
import * as tool136 from "../random/multi-recipe-shopping-list/index.js";
import * as tool137 from "../random/cinema-program-runtime/index.js";
import * as tool138 from "../random/subtitle-timing-practice-set/index.js";
import * as tool139 from "../random/warehouse-order-fulfillment-dataset/index.js";
import * as tool140 from "../random/inventory-abc-classification-dataset/index.js";
import * as tool141 from "../random/pallet-packing-measurement-dataset/index.js";
import * as tool142 from "../random/fifo-inventory-transaction-trace/index.js";
import * as tool143 from "../random/inventory-shrinkage-audit-dataset/index.js";
import * as tool144 from "../random/warehouse-picking-productivity-dataset/index.js";
import * as tool145 from "../random/delivery-attempt-outcome-dataset/index.js";
import * as tool146 from "../random/inventory-forecast-error-dataset/index.js";
import * as tool147 from "../random/cluster-initialization-sensitivity-benchmark/index.js";
import * as tool148 from "../random/density-clustering-noise-benchmark/index.js";
import * as tool149 from "../random/fuzzy-cluster-membership-benchmark/index.js";
import * as tool150 from "../random/streaming-microcluster-benchmark/index.js";
import * as tool151 from "../random/affinity-propagation-preference-benchmark/index.js";
import * as tool152 from "../random/cluster-shape-comparison-benchmark/index.js";
import * as tool153 from "../random/market-basket-transaction-dataset/index.js";
import * as tool154 from "../random/association-rule-threshold-exercise/index.js";
import * as tool155 from "../random/rare-item-support-boundary-corpus/index.js";
import * as tool156 from "../random/cooccurrence-lift-contrast-corpus/index.js";
import * as tool157 from "../random/graph-traversal-quiz/index.js";
import * as tool158 from "../random/bipartite-graph-construction-puzzle/index.js";
import * as tool159 from "../random/graph-representation-round-trip-corpus/index.js";
import * as tool160 from "../random/point-in-polygon-classification-quiz/index.js";
import * as tool161 from "../random/cubic-hermite-curve-bank/index.js";
import * as tool162 from "../random/bilinear-heightmap-tile/index.js";
import * as tool163 from "../random/ski-rental-usage-experiment/index.js";
import * as tool164 from "../random/beam-search-pruning-challenge/index.js";
import * as tool165 from "../random/story-beat-outline/index.js";
import * as tool166 from "../random/character-relationship-web/index.js";
import * as tool167 from "../random/fictional-town-roster/index.js";
import * as tool168 from "../random/fantasy-tavern-menu-card/index.js";
import * as tool169 from "../random/quest-dependency-chain/index.js";
import * as tool170 from "../random/dungeon-room-key/index.js";
import * as tool171 from "../random/fictional-faction-alliance-map/index.js";
import * as tool172 from "../random/worldbuilding-history-timeline/index.js";
import * as tool173 from "../random/in-world-newspaper-front-page/index.js";
import * as tool174 from "../random/comic-panel-storyboard/index.js";
import * as tool175 from "../random/truchet-tile-mosaic/index.js";
import * as tool176 from "../random/cross-stitch-chart/index.js";
import * as tool177 from "../random/quilt-block-arrangement/index.js";
import * as tool178 from "../random/stained-glass-panel-layout/index.js";
import * as tool179 from "../random/dot-to-dot-drawing/index.js";
import * as tool180 from "../random/string-art-pin-pattern/index.js";
import * as tool181 from "../random/wallpaper-motif-repeat/index.js";
import * as tool182 from "../random/css-clip-path-shape/index.js";
import * as tool183 from "../random/css-grid-layout-preset/index.js";
import * as tool184 from "../random/flex-layout-stress-case/index.js";
import * as tool185 from "../random/responsive-breakpoint-set/index.js";
import * as tool186 from "../random/skeleton-screen-layout/index.js";
import * as tool187 from "../random/dashboard-widget-layout/index.js";
import * as tool188 from "../random/selector-specificity-quiz/index.js";
import * as tool189 from "../random/css-custom-property-fallback-corpus/index.js";
import * as tool190 from "../random/object-fit-crop-corpus/index.js";
import * as tool191 from "../random/cadence-chord-progression/index.js";
import * as tool192 from "../random/voice-leading-motion-exercise/index.js";
import * as tool193 from "../random/polyrhythm-event-grid/index.js";
import * as tool194 from "../random/swing-timing-dataset/index.js";
import * as tool195 from "../random/room-mode-frequency-dataset/index.js";
import * as tool196 from "../random/spatial-audio-event-layout/index.js";
import * as tool197 from "../random/tuning-system-comparison-set/index.js";
import * as tool198 from "../random/fictional-planet-profile-set/index.js";
import * as tool199 from "../random/fictional-star-profile-set/index.js";
import * as tool200 from "../random/toy-planetary-system/index.js";
import * as tool201 from "../random/light-travel-time-network/index.js";
import * as tool202 from "../random/fictional-moon-illumination-calendar/index.js";
import * as tool203 from "../random/depth-layered-starfield-dataset/index.js";
import * as tool204 from "../random/semantic-version-ordering-corpus/index.js";
import * as tool205 from "../random/semantic-version-range-corpus/index.js";
import * as tool206 from "../random/unicode-byte-round-trip-corpus/index.js";
import * as tool207 from "../random/numeric-parser-boundary-corpus/index.js";
import * as tool208 from "../random/file-extension-edge-case-corpus/index.js";
import * as tool209 from "../random/quantity-parsing-corpus/index.js";
import * as tool210 from "../random/decimal-rounding-boundary-corpus/index.js";
import * as tool211 from "../random/structured-validation-error-corpus/index.js";
import * as tool212 from "../random/paginated-api-response-sequence/index.js";
import * as tool213 from "../random/news-feed-mock-dataset/index.js";
import * as tool214 from "../random/booking-occupancy-dataset/index.js";
import * as tool215 from "../random/workflow-audit-trail-dataset/index.js";
import * as tool216 from "../random/webhook-retry-trace/index.js";
import * as tool217 from "../random/notification-inbox-dataset/index.js";
import * as tool218 from "../random/product-variant-comparison-fixture/index.js";
import * as tool219 from "../random/activity-heatmap-calendar-dataset/index.js";
import * as tool220 from "../random/kanban-board-snapshot-dataset/index.js";
import * as tool221 from "../random/search-results-relevance-fixture/index.js";
import * as tool222 from "../random/nonogram-line-completion-puzzle/index.js";
import * as tool223 from "../random/kakuro-run-completion-exercise/index.js";
import * as tool224 from "../random/kenken-cage-arithmetic-quiz/index.js";
import * as tool225 from "../random/mastermind-round-dataset/index.js";
import * as tool226 from "../random/wordle-feedback-exercise/index.js";
import * as tool227 from "../random/set-triple-recognition-quiz/index.js";
import * as tool228 from "../random/sliding-tile-scramble/index.js";
import * as tool229 from "../random/word-ladder-challenge/index.js";
import * as tool230 from "../random/inference-rule-proof-cards/index.js";
import * as tool231 from "../random/fallacy-spotting-cards/index.js";
import * as tool232 from "../random/boolean-equivalence-quiz/index.js";
import * as tool233 from "../random/categorical-syllogism-quiz/index.js";
import * as tool234 from "../random/venn-region-identification-puzzle/index.js";
import * as tool235 from "../random/boolean-adder-circuit-trace/index.js";
import * as tool236 from "../random/karnaugh-minterm-practice-corpus/index.js";
import * as tool237 from "../random/truth-table-gap-puzzle/index.js";
import * as tool238 from "../random/existential-import-counterexample-cards/index.js";
import * as tool239 from "../random/weighted-shuffle/index.js";
import * as tool240 from "../random/stratified-row-sample/index.js";
import * as tool241 from "../random/cluster-based-row-sample/index.js";
import * as tool242 from "../random/reservoir-stream-sample/index.js";
import * as tool243 from "../random/balanced-factorial-assignment/index.js";
import * as tool244 from "../random/train-validation-test-split/index.js";
import * as tool245 from "../random/negative-pair-sampler/index.js";
import * as tool246 from "../random/derangement-assignment/index.js";
import * as tool247 from "../random/no-repeat-playlist-cycle/index.js";
import * as tool248 from "../random/epistolary-story-packet/index.js";
import * as tool249 from "../random/unreliable-narrator-evidence/index.js";

const entries = [
  { id: "statistics/chi-square-independence", module: tool0 },
  { id: "statistics/kendall-tau", module: tool1 },
  { id: "statistics/spearman-rank-correlation", module: tool2 },
  { id: "random/chinese-postman-instance", module: tool3 },
  { id: "random/clique-instance", module: tool4 },
  { id: "random/constraint-satisfaction-instance", module: tool5 },
  { id: "random/cutting-stock-instance", module: tool6 },
  { id: "random/eulerian-circuit-test-case", module: tool7 },
  { id: "random/flow-shop-scheduling-instance", module: tool8 },
  { id: "random/hamiltonian-cycle-instance", module: tool9 },
  { id: "random/independent-set-instance", module: tool10 },
  { id: "random/itemset-instance", module: tool11 },
  { id: "random/job-shop-scheduling-instance", module: tool12 },
  { id: "random/knapsack-instance", module: tool13 },
  { id: "random/max-sat-instance", module: tool14 },
  { id: "random/maximum-flow-instance", module: tool15 },
  { id: "random/min-cost-flow-instance", module: tool16 },
  { id: "random/minimum-spanning-tree-test-case", module: tool17 },
  { id: "random/monte-carlo-pi", module: tool18 },
  { id: "random/multiprocessor-scheduling-instance", module: tool19 },
  { id: "random/set-covering-instance", module: tool20 },
  { id: "random/set-partitioning-instance", module: tool21 },
  { id: "random/shortest-path-test-case", module: tool22 },
  { id: "random/strip-packing-instance", module: tool23 },
  { id: "random/traveling-salesman-instance", module: tool24 },
  { id: "random/traveling-salesman-time-windows-instance", module: tool25 },
  { id: "random/variable-size-bin-packing-instance", module: tool26 },
  { id: "random/vehicle-routing-instance", module: tool27 },
  { id: "random/vertex-cover-instance", module: tool28 },
  { id: "data-mining/fp-growth", module: tool29 },
  { id: "date/calendar-overlap-gaps", module: tool30 },
  { id: "statistics/kernel-density-estimator", module: tool31 },
  { id: "statistics/kurtosis", module: tool32 },
  { id: "statistics/mean-absolute-deviation-from-median", module: tool33 },
  { id: "statistics/median-absolute-deviation", module: tool34 },
  { id: "random/monte-carlo-integration", module: tool35 },
  { id: "statistics/principal-component-analysis", module: tool36 },
  { id: "data-mining/rough-set-approximations", module: tool37 },
  { id: "finance/salary-comparison", module: tool38 },
  { id: "data-mining/sequential-pattern-mining", module: tool39 },
  { id: "probability/gaussian-mixture-sampler", module: tool40 },
  { id: "random/monte-carlo-random-walk", module: tool41 },
  { id: "random/monte-carlo-uniform", module: tool42 },
  { id: "random/graph-coloring-instance", module: tool43 },
  { id: "data-structure/cuckoo-hash-trace", module: tool44 },
  { id: "graph/strongly-connected-components", module: tool45 },
  { id: "algebra/solve-linear-system", module: tool46 },
  { id: "text/unified-diff", module: tool47 },
  { id: "random/color-wheel", module: tool48 },
  { id: "random/contrast-constrained-palette", module: tool49 },
  { id: "random/perceptually-distinct-palette", module: tool50 },
  { id: "random/color-vision-deficiency-palette", module: tool51 },
  { id: "random/categorical-color-palette", module: tool52 },
  { id: "random/ui-theme-color-set", module: tool53 },
  { id: "random/mesh-color-pattern", module: tool54 },
  { id: "random/multicolor-plaid-pattern", module: tool55 },
  { id: "random/geometric-color-pattern", module: tool56 },
  { id: "random/food-by-nutrient", module: tool57 },
  { id: "random/scale-melody", module: tool58 },
  { id: "random/interval-melody", module: tool59 },
  { id: "random/rhythm-measure", module: tool60 },
  { id: "random/drum-pattern", module: tool61 },
  { id: "random/positive-definite-matrix", module: tool62 },
  { id: "random/orthogonal-matrix", module: tool63 },
  { id: "random/connected-graph-test-case", module: tool64 },
  { id: "random/dag-topology-test-case", module: tool65 },
  { id: "random/csv-table", module: tool66 },
  { id: "random/nested-json-document", module: tool67 },
  { id: "random/json-patch-test-case", module: tool68 },
  { id: "random/time-series", module: tool69 },
  { id: "random/correlated-point-dataset", module: tool70 },
  { id: "random/outlier-detection-test-case", module: tool71 },
  { id: "random/clustered-point-dataset", module: tool72 },
  { id: "random/missing-value-table", module: tool73 },
  { id: "random/ipv4-cidr-block-set", module: tool74 },
  { id: "random/calendar-event-set", module: tool75 },
  { id: "random/recurrence-schedule", module: tool76 },
  { id: "random/word-search-puzzle", module: tool77 },
  { id: "random/css-keyframe-motion", module: tool78 },
  { id: "random/identicon", module: tool79 },
  { id: "random/pixel-art-tile", module: tool80 },
  { id: "random/svg-constellation-pattern", module: tool81 },
  { id: "random/terrain-profile", module: tool82 },
  { id: "random/bingo-card", module: tool83 },
  { id: "random/tournament-bracket", module: tool84 },
  { id: "random/round-robin-schedule", module: tool85 },
  { id: "random/overdispersed-count-experiment", module: tool86 },
  { id: "random/heavy-tail-comparison-experiment", module: tool87 },
  { id: "random/mixture-distribution-experiment", module: tool88 },
  { id: "random/bootstrap-interval-experiment", module: tool89 },
  { id: "random/ab-test-experiment", module: tool90 },
  { id: "random/paired-t-test-test-case", module: tool91 },
  { id: "random/anova-test-case", module: tool92 },
  { id: "random/rank-sum-test-case", module: tool93 },
  { id: "random/confidence-interval-coverage-experiment", module: tool94 },
  { id: "random/linear-regression-noise-benchmark", module: tool95 },
  { id: "random/multiple-testing-test-case", module: tool96 },
  { id: "random/boolean-formula-cnf-exercise", module: tool97 },
  { id: "random/bloom-filter-workload", module: tool98 },
  { id: "random/counting-bloom-filter-workload", module: tool99 },
  { id: "random/cardinality-sketch-workload", module: tool100 },
  { id: "random/minhash-similarity-workload", module: tool101 },
  { id: "random/lsh-candidate-workload", module: tool102 },
  { id: "random/string-distance-matrix", module: tool103 },
  { id: "random/solvable-maze-test-case", module: tool104 },
  { id: "random/minimax-game-tree-test-case", module: tool105 },
  { id: "random/ridge-regression-benchmark", module: tool106 },
  { id: "random/polynomial-regression-benchmark", module: tool107 },
  { id: "random/feedforward-network-test-case", module: tool108 },
  { id: "random/attention-matrix-test-case", module: tool109 },
  { id: "random/payoff-matrix-game", module: tool110 },
  { id: "random/geodesic-route-set", module: tool111 },
  { id: "random/debounce-signal-test-case", module: tool112 },
  { id: "random/http-cookie-round-trip-corpus", module: tool113 },
  { id: "random/http-set-cookie-attribute-corpus", module: tool114 },
  { id: "random/html-attribute-quoting-corpus", module: tool115 },
  { id: "random/html-text-extraction-corpus", module: tool116 },
  { id: "random/csv-quoting-edge-case-corpus", module: tool117 },
  { id: "random/csv-pivot-practice-dataset", module: tool118 },
  { id: "random/json-pointer-navigation-exercise", module: tool119 },
  { id: "random/json-flattening-round-trip-corpus", module: tool120 },
  { id: "random/text-encoding-detection-practice-cards", module: tool121 },
  { id: "random/barcode-label-sheet", module: tool122 },
  { id: "random/qr-message-card-set", module: tool123 },
  { id: "random/upc-compression-round-trip-corpus", module: tool124 },
  { id: "random/identifier-transcription-error-corpus", module: tool125 },
  { id: "random/sqids-reversible-id-fixture", module: tool126 },
  { id: "random/palindrome-construction-puzzle", module: tool127 },
  { id: "random/word-wrap-boundary-corpus", module: tool128 },
  { id: "random/cloze-practice-packet", module: tool129 },
  { id: "random/fair-classroom-calling-sequence", module: tool130 },
  { id: "random/jigsaw-learning-assignment", module: tool131 },
  { id: "random/differentiated-activity-assignment", module: tool132 },
  { id: "random/assessment-item-sampler", module: tool133 },
  { id: "random/faded-solution-practice-packet", module: tool134 },
  { id: "random/classroom-station-rotation", module: tool135 },
  { id: "random/multi-recipe-shopping-list", module: tool136 },
  { id: "random/cinema-program-runtime", module: tool137 },
  { id: "random/subtitle-timing-practice-set", module: tool138 },
  { id: "random/warehouse-order-fulfillment-dataset", module: tool139 },
  { id: "random/inventory-abc-classification-dataset", module: tool140 },
  { id: "random/pallet-packing-measurement-dataset", module: tool141 },
  { id: "random/fifo-inventory-transaction-trace", module: tool142 },
  { id: "random/inventory-shrinkage-audit-dataset", module: tool143 },
  { id: "random/warehouse-picking-productivity-dataset", module: tool144 },
  { id: "random/delivery-attempt-outcome-dataset", module: tool145 },
  { id: "random/inventory-forecast-error-dataset", module: tool146 },
  {
    id: "random/cluster-initialization-sensitivity-benchmark",
    module: tool147,
  },
  { id: "random/density-clustering-noise-benchmark", module: tool148 },
  { id: "random/fuzzy-cluster-membership-benchmark", module: tool149 },
  { id: "random/streaming-microcluster-benchmark", module: tool150 },
  { id: "random/affinity-propagation-preference-benchmark", module: tool151 },
  { id: "random/cluster-shape-comparison-benchmark", module: tool152 },
  { id: "random/market-basket-transaction-dataset", module: tool153 },
  { id: "random/association-rule-threshold-exercise", module: tool154 },
  { id: "random/rare-item-support-boundary-corpus", module: tool155 },
  { id: "random/cooccurrence-lift-contrast-corpus", module: tool156 },
  { id: "random/graph-traversal-quiz", module: tool157 },
  { id: "random/bipartite-graph-construction-puzzle", module: tool158 },
  { id: "random/graph-representation-round-trip-corpus", module: tool159 },
  { id: "random/point-in-polygon-classification-quiz", module: tool160 },
  { id: "random/cubic-hermite-curve-bank", module: tool161 },
  { id: "random/bilinear-heightmap-tile", module: tool162 },
  { id: "random/ski-rental-usage-experiment", module: tool163 },
  { id: "random/beam-search-pruning-challenge", module: tool164 },
  { id: "random/story-beat-outline", module: tool165 },
  { id: "random/character-relationship-web", module: tool166 },
  { id: "random/fictional-town-roster", module: tool167 },
  { id: "random/fantasy-tavern-menu-card", module: tool168 },
  { id: "random/quest-dependency-chain", module: tool169 },
  { id: "random/dungeon-room-key", module: tool170 },
  { id: "random/fictional-faction-alliance-map", module: tool171 },
  { id: "random/worldbuilding-history-timeline", module: tool172 },
  { id: "random/in-world-newspaper-front-page", module: tool173 },
  { id: "random/comic-panel-storyboard", module: tool174 },
  { id: "random/truchet-tile-mosaic", module: tool175 },
  { id: "random/cross-stitch-chart", module: tool176 },
  { id: "random/quilt-block-arrangement", module: tool177 },
  { id: "random/stained-glass-panel-layout", module: tool178 },
  { id: "random/dot-to-dot-drawing", module: tool179 },
  { id: "random/string-art-pin-pattern", module: tool180 },
  { id: "random/wallpaper-motif-repeat", module: tool181 },
  { id: "random/css-clip-path-shape", module: tool182 },
  { id: "random/css-grid-layout-preset", module: tool183 },
  { id: "random/flex-layout-stress-case", module: tool184 },
  { id: "random/responsive-breakpoint-set", module: tool185 },
  { id: "random/skeleton-screen-layout", module: tool186 },
  { id: "random/dashboard-widget-layout", module: tool187 },
  { id: "random/selector-specificity-quiz", module: tool188 },
  { id: "random/css-custom-property-fallback-corpus", module: tool189 },
  { id: "random/object-fit-crop-corpus", module: tool190 },
  { id: "random/cadence-chord-progression", module: tool191 },
  { id: "random/voice-leading-motion-exercise", module: tool192 },
  { id: "random/polyrhythm-event-grid", module: tool193 },
  { id: "random/swing-timing-dataset", module: tool194 },
  { id: "random/room-mode-frequency-dataset", module: tool195 },
  { id: "random/spatial-audio-event-layout", module: tool196 },
  { id: "random/tuning-system-comparison-set", module: tool197 },
  { id: "random/fictional-planet-profile-set", module: tool198 },
  { id: "random/fictional-star-profile-set", module: tool199 },
  { id: "random/toy-planetary-system", module: tool200 },
  { id: "random/light-travel-time-network", module: tool201 },
  { id: "random/fictional-moon-illumination-calendar", module: tool202 },
  { id: "random/depth-layered-starfield-dataset", module: tool203 },
  { id: "random/semantic-version-ordering-corpus", module: tool204 },
  { id: "random/semantic-version-range-corpus", module: tool205 },
  { id: "random/unicode-byte-round-trip-corpus", module: tool206 },
  { id: "random/numeric-parser-boundary-corpus", module: tool207 },
  { id: "random/file-extension-edge-case-corpus", module: tool208 },
  { id: "random/quantity-parsing-corpus", module: tool209 },
  { id: "random/decimal-rounding-boundary-corpus", module: tool210 },
  { id: "random/structured-validation-error-corpus", module: tool211 },
  { id: "random/paginated-api-response-sequence", module: tool212 },
  { id: "random/news-feed-mock-dataset", module: tool213 },
  { id: "random/booking-occupancy-dataset", module: tool214 },
  { id: "random/workflow-audit-trail-dataset", module: tool215 },
  { id: "random/webhook-retry-trace", module: tool216 },
  { id: "random/notification-inbox-dataset", module: tool217 },
  { id: "random/product-variant-comparison-fixture", module: tool218 },
  { id: "random/activity-heatmap-calendar-dataset", module: tool219 },
  { id: "random/kanban-board-snapshot-dataset", module: tool220 },
  { id: "random/search-results-relevance-fixture", module: tool221 },
  { id: "random/nonogram-line-completion-puzzle", module: tool222 },
  { id: "random/kakuro-run-completion-exercise", module: tool223 },
  { id: "random/kenken-cage-arithmetic-quiz", module: tool224 },
  { id: "random/mastermind-round-dataset", module: tool225 },
  { id: "random/wordle-feedback-exercise", module: tool226 },
  { id: "random/set-triple-recognition-quiz", module: tool227 },
  { id: "random/sliding-tile-scramble", module: tool228 },
  { id: "random/word-ladder-challenge", module: tool229 },
  { id: "random/inference-rule-proof-cards", module: tool230 },
  { id: "random/fallacy-spotting-cards", module: tool231 },
  { id: "random/boolean-equivalence-quiz", module: tool232 },
  { id: "random/categorical-syllogism-quiz", module: tool233 },
  { id: "random/venn-region-identification-puzzle", module: tool234 },
  { id: "random/boolean-adder-circuit-trace", module: tool235 },
  { id: "random/karnaugh-minterm-practice-corpus", module: tool236 },
  { id: "random/truth-table-gap-puzzle", module: tool237 },
  { id: "random/existential-import-counterexample-cards", module: tool238 },
  { id: "random/weighted-shuffle", module: tool239 },
  { id: "random/stratified-row-sample", module: tool240 },
  { id: "random/cluster-based-row-sample", module: tool241 },
  { id: "random/reservoir-stream-sample", module: tool242 },
  { id: "random/balanced-factorial-assignment", module: tool243 },
  { id: "random/train-validation-test-split", module: tool244 },
  { id: "random/negative-pair-sampler", module: tool245 },
  { id: "random/derangement-assignment", module: tool246 },
  { id: "random/no-repeat-playlist-cycle", module: tool247 },
  { id: "random/epistolary-story-packet", module: tool248 },
  { id: "random/unreliable-narrator-evidence", module: tool249 },
] as const;

describe("M250 explicitly scoped public subpath contracts", () => {
  for (const { id, module } of entries) {
    it(id + " exports its own executable and one canonical example", () => {
      expect(module.default.id).toBe(id);
      expect(module.example).toHaveProperty("input");
      expect(module.example).toHaveProperty("output");
      const examples = Object.values(module).filter(
        (value) =>
          typeof value === "object" &&
          value !== null &&
          Object.hasOwn(value, "input") &&
          Object.hasOwn(value, "output"),
      );
      expect(new Set(examples).size).toBe(1);
      expect(JSON.parse(JSON.stringify(module.example))).toEqual(
        module.example,
      );
      expect(module.default.execute(module.example.input)).toEqual({
        ok: true,
        output: module.example.output,
      });
    });
    it(
      id +
        " rejects missing required fields and undeclared inputs with stable diagnostics",
      () => {
        const required = module.default.inputSchema.required;
        if (!required?.length)
          throw new Error(
            "Each checkpoint model needs explicit required inputs.",
          );
        // These three bounded statistical APIs intentionally report one grouped
        // domain diagnostic. Do not impose the model helper's per-field codes
        // on a different, explicitly tested validation contract.
        const groupedIssue =
          id === "statistics/chi-square-independence"
            ? { field: "observed", code: "invalid_contingency_table" }
            : id === "statistics/kendall-tau" ||
                id === "statistics/spearman-rank-correlation"
              ? { field: "first", code: "invalid_paired_series" }
              : null;
        const empty = module.default.execute({});
        expect(empty).toMatchObject({
          ok: false,
          error: {
            issues: expect.arrayContaining(
              (groupedIssue
                ? [groupedIssue]
                : required.map((field) => ({ field, code: "required_field" }))
              ).map((issue) => expect.objectContaining(issue)),
            ),
          },
        });
        if (empty.ok) throw new Error("Empty input unexpectedly succeeded.");
        expect(empty.error.issues).toHaveLength(
          groupedIssue ? 1 : required.length,
        );
        for (const field of required) {
          const missing = Object.fromEntries(
            Object.entries(module.example.input).filter(
              ([key]) => key !== field,
            ),
          );
          expect(module.default.execute(missing)).toMatchObject({
            ok: false,
            error: {
              issues: expect.arrayContaining([
                expect.objectContaining(
                  groupedIssue ?? { field, code: "required_field" },
                ),
              ]),
            },
          });
        }
        expect(
          module.default.execute({
            ...module.example.input,
            undeclaredM250Field: true,
          }),
        ).toMatchObject({
          ok: false,
          error: {
            issues: [
              groupedIssue ?? {
                field: "undeclaredM250Field",
                code: "unknown_field",
              },
            ],
          },
        });
      },
    );
  }
});
