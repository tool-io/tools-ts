import { createMeasurementSizeTool } from "../measurementTool.js";
import { cloakReconstructionConfig } from "../measurementConfigs.js";

export const cloakReconstructionSizeTool = createMeasurementSizeTool(
  cloakReconstructionConfig,
);
export default cloakReconstructionSizeTool;
