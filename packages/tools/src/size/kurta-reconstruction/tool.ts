import { createMeasurementSizeTool } from "../measurementTool.js";
import { kurtaReconstructionConfig } from "../measurementConfigs.js";

export const kurtaReconstructionSizeTool = createMeasurementSizeTool(
  kurtaReconstructionConfig,
);
export default kurtaReconstructionSizeTool;
