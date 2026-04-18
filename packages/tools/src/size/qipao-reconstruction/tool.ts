import { createMeasurementSizeTool } from "../measurementTool.js";
import { qipaoReconstructionConfig } from "../measurementConfigs.js";

export const qipaoReconstructionSizeTool = createMeasurementSizeTool(
  qipaoReconstructionConfig,
);
export default qipaoReconstructionSizeTool;
