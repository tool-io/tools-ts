import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OvenDryMoistureInput = {
  readonly ovenDryMassG: number;
  readonly wetMassG: number;
};

export type OvenDryMoistureOutput = {
  readonly moisturePercent: number;
};

export const ovenDryMoistureExample = {
  input: { ovenDryMassG: 100, wetMassG: 120 },
  output: { moisturePercent: 20 },
} satisfies ToolExample<OvenDryMoistureInput, OvenDryMoistureOutput>;

export const ovenDryMoistureTool = createSimpleTool({
  id: "carpentry/holzfeuchte-darrprobe-103grad",
  title: "Oven Dry Moisture Content",
  description:
    "Compute wood moisture content in percent from wet and oven-dry masses.",
  inputs: [
    {
      description: "Oven-dry mass in grams after drying at 103 degrees.",
      id: "ovenDryMassG",
      kind: "number",
      label: "Oven-dry mass",
      unit: "g",
    },
    {
      description: "Wet mass in grams before drying.",
      id: "wetMassG",
      kind: "number",
      label: "Wet mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Wood moisture content in percent.",
      format: "percent",
      id: "moisturePercent",
      kind: "number",
      label: "Moisture content",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const ovenDryMassG = input.ovenDryMassG as number;
    if (!(ovenDryMassG > 0))
      simpleError(
        "ovenDryMassG",
        "The oven-dry mass must be greater than zero grams.",
        "invalid_masses",
      );
    const wetMassG = input.wetMassG as number;
    if (wetMassG <= ovenDryMassG)
      simpleError(
        "wetMassG",
        "The wet mass must exceed the oven-dry mass.",
        "invalid_masses",
      );
    return {
      moisturePercent: ((wetMassG - ovenDryMassG) / ovenDryMassG) * 100,
    };
  },
});
export const runOvenDryMoisture = ovenDryMoistureTool.execute;
export default ovenDryMoistureTool;
