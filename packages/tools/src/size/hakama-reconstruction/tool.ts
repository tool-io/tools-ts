import { createMeasurementSizeTool } from "../measurementTool.js";
import { hakamaReconstructionConfig } from "../measurementConfigs.js";

export const hakamaReconstructionSizeTool = createMeasurementSizeTool(
  hakamaReconstructionConfig,
);
export default hakamaReconstructionSizeTool;
