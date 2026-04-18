import { createMeasurementSizeTool } from "../measurementTool.js";
import { babyClothingConfig } from "../measurementConfigs.js";

export const babyClothingSizeTool =
  createMeasurementSizeTool(babyClothingConfig);
export default babyClothingSizeTool;
