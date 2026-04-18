import { createMeasurementSizeTool } from "../measurementTool.js";
import { compressionGarmentConfig } from "../measurementConfigs.js";

export const compressionGarmentSizeTool = createMeasurementSizeTool(
  compressionGarmentConfig,
);
export default compressionGarmentSizeTool;
