import { invalidInput } from "../../core/result.js";
import { measurementSizeConfigs } from "../measurementConfigs.js";
import {
  createMeasurementSizeTableForConfig,
  createMeasurementSizeTool as createConfiguredMeasurementSizeTool,
  recommendMeasurementSizeForConfig,
  type MeasurementSizeKind,
} from "../measurementTool.js";

export * from "../measurementTool.js";
export { measurementSizeConfigs } from "../measurementConfigs.js";

export const recommendMeasurementSize = (
  kind: MeasurementSizeKind,
  input: unknown,
) => {
  const config =
    measurementSizeConfigs[kind as keyof typeof measurementSizeConfigs];
  return config
    ? recommendMeasurementSizeForConfig(config, input)
    : invalidInput([
        {
          code: "unknown_size_kind",
          field: "kind",
          message: "Unknown size tool.",
        },
      ]);
};

export const createMeasurementSizeTable = (
  kind: MeasurementSizeKind,
  measurementsCm: Readonly<Record<string, number>>,
) => {
  const config =
    measurementSizeConfigs[kind as keyof typeof measurementSizeConfigs];
  return config
    ? createMeasurementSizeTableForConfig(config, kind, measurementsCm)
    : [];
};

export const createMeasurementSizeTool = (kind: MeasurementSizeKind) => {
  const config =
    measurementSizeConfigs[kind as keyof typeof measurementSizeConfigs];
  if (!config) throw new TypeError("Unknown size tool.");
  return createConfiguredMeasurementSizeTool(config);
};

export { beltSizeTool } from "../belt/tool.js";
export { collarSizeTool } from "../collar/tool.js";
export { dressSizeTool } from "../dress/tool.js";
export { dressShirtSizeTool } from "../dress-shirt/tool.js";
export { gloveSizeTool } from "../gloves/tool.js";
export { pantsSizeTool } from "../pants/tool.js";
export { ringSizeTool } from "../ring/tool.js";
export { shawlSizeTool } from "../shawl/tool.js";
export { smartRingSizeTool } from "../smart-ring/tool.js";
export { sockSizeTool } from "../socks/tool.js";
export { suitJacketSizeTool } from "../suit-jacket/tool.js";
export { sweaterSizeTool } from "../sweater/tool.js";
export { tShirtSizeTool } from "../t-shirt/tool.js";
export { watchBandSizeTool } from "../watch-band/tool.js";
