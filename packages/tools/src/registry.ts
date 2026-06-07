import { bodyMassIndexTool } from "./body-mass-index/index.js";
import { compareTool } from "./compare/index.js";
import type { ToolDefinition } from "./core/definition.js";
import { createMeasurementSizeTool, measurementSizeConfigs } from './size/measurements/index.js';
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
