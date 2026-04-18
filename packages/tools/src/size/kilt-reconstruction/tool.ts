import { createMeasurementSizeTool } from "../measurementTool.js";
import { kiltReconstructionConfig } from "../measurementConfigs.js";

export const kiltReconstructionSizeTool = createMeasurementSizeTool(
  kiltReconstructionConfig,
);
export default kiltReconstructionSizeTool;
