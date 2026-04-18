import { createMeasurementSizeTool } from "../measurementTool.js";
import { socksConfig } from "../measurementConfigs.js";

export const sockSizeTool = createMeasurementSizeTool(socksConfig);
export default sockSizeTool;
