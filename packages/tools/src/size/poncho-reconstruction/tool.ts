import { createMeasurementSizeTool } from "../measurementTool.js";
import { ponchoReconstructionConfig } from "../measurementConfigs.js";

export const ponchoReconstructionSizeTool = createMeasurementSizeTool(
  ponchoReconstructionConfig,
);
export default ponchoReconstructionSizeTool;
