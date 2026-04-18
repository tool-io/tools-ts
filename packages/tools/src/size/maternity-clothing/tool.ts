import { createMeasurementSizeTool } from "../measurementTool.js";
import { maternityClothingConfig } from "../measurementConfigs.js";

export const maternityClothingSizeTool = createMeasurementSizeTool(
  maternityClothingConfig,
);
export default maternityClothingSizeTool;
