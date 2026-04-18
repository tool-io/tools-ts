import { createMeasurementSizeTool } from "../measurementTool.js";
import { batteryConfig } from "../measurementConfigs.js";

export const batterySizeTool = createMeasurementSizeTool(batteryConfig);
export default batterySizeTool;
