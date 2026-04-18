import { createMeasurementSizeTool } from "../measurementTool.js";
import { peplosReconstructionConfig } from "../measurementConfigs.js";

export const peplosReconstructionSizeTool = createMeasurementSizeTool(
  peplosReconstructionConfig,
);
export default peplosReconstructionSizeTool;
