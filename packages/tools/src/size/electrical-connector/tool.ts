import { createMeasurementSizeTool } from "../measurementTool.js";
import { electricalConnectorConfig } from "../measurementConfigs.js";

export const electricalConnectorSizeTool = createMeasurementSizeTool(
  electricalConnectorConfig,
);
export default electricalConnectorSizeTool;
