import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OilDensityInput = {
  readonly apiGravity: number;
};

export type OilDensityOutput = {
  readonly specificGravity: number;
  readonly densityKgPerCubicMetre: number;
};

export const calculateOilDensity = (
  input: OilDensityInput,
): OilDensityOutput => {
  if (!(input.apiGravity + 131.5 > 0))
    return simpleError(
      "apiGravity",
      "API gravity must exceed -131.5 so the specific gravity stays positive.",
      "invalid_api_gravity",
    );
  const specificGravity = 141.5 / (input.apiGravity + 131.5);
  return { specificGravity, densityKgPerCubicMetre: specificGravity * 1000 };
};

export const oilDensityExample = {
  input: { apiGravity: 40 },
  output: {
    specificGravity: 0.8250728862973761,
    densityKgPerCubicMetre: 825.072886297376,
  },
} satisfies ToolExample<OilDensityInput, OilDensityOutput>;

export const oilDensityTool = createSimpleTool({
  id: "geology/oil-density",
  title: "Oil Density Calculator",
  description:
    "Convert API gravity to crude oil specific gravity and density in kg/m3.",
  inputs: [
    {
      description: "Crude oil gravity in degrees API.",
      id: "apiGravity",
      kind: "number",
      label: "API gravity",
    },
  ],
  outputs: [
    {
      description: "Specific gravity relative to water at 15.6 C.",
      id: "specificGravity",
      kind: "number",
      label: "Specific gravity",
    },
    {
      description: "Oil density in kilograms per cubic metre.",
      id: "densityKgPerCubicMetre",
      kind: "number",
      label: "Density",
    },
  ],
  calculate: (input) =>
    calculateOilDensity(input as unknown as OilDensityInput),
});

export const runOilDensity = oilDensityTool.execute;
export default oilDensityTool;
