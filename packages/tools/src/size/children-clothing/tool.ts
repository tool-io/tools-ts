import { createMeasurementSizeTool } from "../measurementTool.js";
import { childrenClothingConfig } from "../measurementConfigs.js";

export const childrenClothingSizeTool = createMeasurementSizeTool(
  childrenClothingConfig,
);
export default childrenClothingSizeTool;
