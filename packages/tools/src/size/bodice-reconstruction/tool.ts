import { createMeasurementSizeTool } from "../measurementTool.js";
import { bodiceReconstructionConfig } from "../measurementConfigs.js";

export const bodiceReconstructionSizeTool = createMeasurementSizeTool(
  bodiceReconstructionConfig,
);
export default bodiceReconstructionSizeTool;
