import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelativePermeabilityOilWaterInput = {
  readonly waterSaturation: number;
  readonly residualWaterSaturation?: number;
  readonly residualOilSaturation?: number;
  readonly waterEndpointKrw?: number;
  readonly oilEndpointKro?: number;
  readonly waterCoreyExponent?: number;
  readonly oilCoreyExponent?: number;
};

export type RelativePermeabilityOilWaterOutput = {
  readonly normalizedWaterSaturation: number;
  readonly waterRelativePermeability: number;
  readonly oilRelativePermeability: number;
};

export const calculateRelativePermeabilityOilWater = (
  input: RelativePermeabilityOilWaterInput,
): RelativePermeabilityOilWaterOutput => {
  const residualWaterSaturation = input.residualWaterSaturation ?? 0;
  const residualOilSaturation = input.residualOilSaturation ?? 0;
  const waterEndpointKrw = input.waterEndpointKrw ?? 1;
  const oilEndpointKro = input.oilEndpointKro ?? 1;
  const waterCoreyExponent = input.waterCoreyExponent ?? 2;
  const oilCoreyExponent = input.oilCoreyExponent ?? 2;
  if (!(residualWaterSaturation >= 0 && residualOilSaturation >= 0))
    simpleError(
      "residualWaterSaturation",
      "Residual saturations must be non-negative.",
      "invalid_saturation",
    );
  const mobileRange = 1 - residualWaterSaturation - residualOilSaturation;
  if (!(mobileRange > 0))
    simpleError(
      "residualOilSaturation",
      "Residual saturations must sum to less than one.",
      "invalid_saturation",
    );
  if (!(
    input.waterSaturation >= residualWaterSaturation &&
    input.waterSaturation <= 1 - residualOilSaturation
  ))
    simpleError(
      "waterSaturation",
      "Water saturation must lie between the residual endpoints.",
      "invalid_saturation",
    );
  for (const key of [
    "waterEndpointKrw",
    "oilEndpointKro",
    "waterCoreyExponent",
    "oilCoreyExponent",
  ] as const)
    if (!((input[key] as number) >= 0))
      simpleError(
        key,
        "Endpoints and exponents must be non-negative.",
        "invalid_exponent",
      );
  const normalizedWaterSaturation =
    (input.waterSaturation - residualWaterSaturation) / mobileRange;
  return {
    normalizedWaterSaturation,
    waterRelativePermeability:
      waterEndpointKrw * normalizedWaterSaturation ** waterCoreyExponent,
    oilRelativePermeability:
      oilEndpointKro * (1 - normalizedWaterSaturation) ** oilCoreyExponent,
  };
};

export const relativePermeabilityOilWaterExample = {
  input: {
    waterSaturation: 0.6,
    residualWaterSaturation: 0.2,
    residualOilSaturation: 0.15,
  },
  output: {
    normalizedWaterSaturation: 0.6153846153846153,
    waterRelativePermeability: 0.3786982248520709,
    oilRelativePermeability: 0.1479289940828403,
  },
} satisfies ToolExample<
  RelativePermeabilityOilWaterInput,
  RelativePermeabilityOilWaterOutput
>;

export const relativePermeabilityOilWaterTool = createSimpleTool({
  id: "geology/relative-permeability-oil-water",
  title: "Relative Permeability Oil Water Calculator",
  description:
    "Compute Corey oil-water relative permeabilities from saturation with residual saturations, Corey exponents and endpoint values.",
  inputs: [
    {
      description: "Water saturation as a fraction.",
      id: "waterSaturation",
      kind: "number",
      label: "Sw",
      maximum: 1,
    },
    {
      default: 0,
      description: "Residual water saturation as a fraction.",
      id: "residualWaterSaturation",
      kind: "number",
      label: "Swr",
    },
    {
      default: 0,
      description: "Residual oil saturation as a fraction.",
      id: "residualOilSaturation",
      kind: "number",
      label: "Sorw",
    },
    {
      default: 1,
      description: "Water relative permeability endpoint krw°.",
      id: "waterEndpointKrw",
      kind: "number",
      label: "krw end point",
    },
    {
      default: 1,
      description: "Oil relative permeability endpoint kro°.",
      id: "oilEndpointKro",
      kind: "number",
      label: "kro end point",
    },
    {
      default: 2,
      description: "Water Corey exponent nw.",
      id: "waterCoreyExponent",
      kind: "number",
      label: "nw",
    },
    {
      default: 2,
      description: "Oil Corey exponent no.",
      id: "oilCoreyExponent",
      kind: "number",
      label: "no",
    },
  ],
  outputs: [
    {
      description: "Normalized water saturation between zero and one.",
      id: "normalizedWaterSaturation",
      kind: "number",
      label: "Sw*",
    },
    {
      description: "Water relative permeability.",
      id: "waterRelativePermeability",
      kind: "number",
      label: "krw",
    },
    {
      description: "Oil relative permeability.",
      id: "oilRelativePermeability",
      kind: "number",
      label: "kro",
    },
  ],
  calculate: (input) =>
    calculateRelativePermeabilityOilWater(
      input as unknown as RelativePermeabilityOilWaterInput,
    ),
});

export const runRelativePermeabilityOilWater =
  relativePermeabilityOilWaterTool.execute;
export default relativePermeabilityOilWaterTool;
