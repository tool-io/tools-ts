import { bodyMassIndexTool } from "./body-mass-index/index.js";
import { compareTool } from "./compare/index.js";
import type { ToolDefinition } from "./core/definition.js";
import { numericDatasetParserTool } from "./parse/numeric-dataset/index.js";
import { medianTool } from "./statistics/median/index.js";
import { benjaminiHochbergTool } from "./statistics/benjamini-hochberg/index.js";
import { bonferroniCorrectionTool } from "./statistics/bonferroni-correction/index.js";
import { bootstrapStandardErrorTool } from "./statistics/bootstrap-standard-error/index.js";
import { holmBonferroniTool } from "./statistics/holm-bonferroni/index.js";
import { jackknifeBiasTool } from "./statistics/jackknife-bias/index.js";
import { kruskalWallisTool } from "./statistics/kruskal-wallis/index.js";
import { mannWhitneyUTool } from "./statistics/mann-whitney-u/index.js";
import { pairedTTestTool } from "./statistics/paired-t-test/index.js";
import { twoSampleTTestTool } from "./statistics/two-sample-t-test/index.js";
import { wilcoxonSignedRankTool } from "./statistics/wilcoxon-signed-rank/index.js";
import {
  createMeasurementSizeTool,
  measurementSizeConfigs,
} from "./size/measurements/index.js";
import {
  bedSizeTool,
  beltSizeTool,
  collarSizeTool,
  dressShirtSizeTool,
  dressSizeTool,
  gloveSizeTool,
  pantsSizeTool,
  ringSizeTool,
  shawlSizeTool,
  shoeSizeTool,
  sizeTool,
  smartRingSizeTool,
  sockSizeTool,
  suitJacketSizeTool,
  sweaterSizeTool,
  tShirtSizeTool,
  watchBandSizeTool,
} from "./size/index.js";

export type RegisteredTool = ToolDefinition<unknown, unknown>;

export const toolRegistry = new Map<string, RegisteredTool>([
  [bodyMassIndexTool.id, bodyMassIndexTool],
  [compareTool.id, compareTool],
  [numericDatasetParserTool.id, numericDatasetParserTool],
  [medianTool.id, medianTool],
  [benjaminiHochbergTool.id, benjaminiHochbergTool],
  [bonferroniCorrectionTool.id, bonferroniCorrectionTool],
  [bootstrapStandardErrorTool.id, bootstrapStandardErrorTool],
  [holmBonferroniTool.id, holmBonferroniTool],
  [jackknifeBiasTool.id, jackknifeBiasTool],
  [kruskalWallisTool.id, kruskalWallisTool],
  [mannWhitneyUTool.id, mannWhitneyUTool],
  [pairedTTestTool.id, pairedTTestTool],
  [twoSampleTTestTool.id, twoSampleTTestTool],
  [wilcoxonSignedRankTool.id, wilcoxonSignedRankTool],
  [bedSizeTool.id, bedSizeTool],
  [beltSizeTool.id, beltSizeTool],
  [collarSizeTool.id, collarSizeTool],
  [dressSizeTool.id, dressSizeTool],
  [dressShirtSizeTool.id, dressShirtSizeTool],
  [gloveSizeTool.id, gloveSizeTool],
  [pantsSizeTool.id, pantsSizeTool],
  [ringSizeTool.id, ringSizeTool],
  [shawlSizeTool.id, shawlSizeTool],
  [shoeSizeTool.id, shoeSizeTool],
  [sizeTool.id, sizeTool],
  [smartRingSizeTool.id, smartRingSizeTool],
  [sockSizeTool.id, sockSizeTool],
  [suitJacketSizeTool.id, suitJacketSizeTool],
  [sweaterSizeTool.id, sweaterSizeTool],
  [tShirtSizeTool.id, tShirtSizeTool],
  [watchBandSizeTool.id, watchBandSizeTool],
]);

for (const kind of Object.keys(measurementSizeConfigs)) {
  const tool = createMeasurementSizeTool(kind);
  toolRegistry.set(tool.id, tool);
}

export const getTool = (id: string): RegisteredTool | undefined =>
  toolRegistry.get(id);
