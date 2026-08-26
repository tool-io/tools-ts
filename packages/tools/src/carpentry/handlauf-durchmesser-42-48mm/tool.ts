import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HandrailDiameterCheckInput = {
  readonly diameterMm: number;
};

export type HandrailDiameterCheckOutput = {
  readonly gripDeviationMm: number;
  readonly isComfortableGrip: boolean;
};

export const handrailDiameterExample = {
  input: { diameterMm: 38 },
  output: { gripDeviationMm: 4, isComfortableGrip: false },
} satisfies ToolExample<
  HandrailDiameterCheckInput,
  HandrailDiameterCheckOutput
>;

export const handrailDiameterTool = createSimpleTool({
  id: "carpentry/handlauf-durchmesser-42-48mm",
  title: "Handrail Diameter Check",
  description:
    "Check whether a handrail diameter lies in the comfortable 42 to 48 mm grip range and report the deviation.",
  inputs: [
    {
      description: "Handrail diameter in millimeters.",
      id: "diameterMm",
      kind: "number",
      label: "Diameter",
      maximum: 80,
      minimum: 20,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "True when the diameter is between 42 and 48 mm inclusive.",
      id: "isComfortableGrip",
      kind: "boolean",
      label: "Comfortable grip",
    },
    {
      description:
        "Distance outside the comfortable range in millimeters, zero when inside.",
      id: "gripDeviationMm",
      kind: "number",
      label: "Grip deviation",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const diameterMm = input.diameterMm as number;
    const isComfortableGrip = diameterMm >= 42 && diameterMm <= 48;
    return {
      isComfortableGrip,
      gripDeviationMm: isComfortableGrip
        ? 0
        : diameterMm < 42
          ? 42 - diameterMm
          : diameterMm - 48,
    };
  },
});
export const runHandrailDiameter = handrailDiameterTool.execute;
export default handrailDiameterTool;
