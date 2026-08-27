import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelativePermeabilityGasOilInput = {
  readonly gasSaturation: number;
  readonly residualGasSaturation?: number;
  readonly residualOilSaturation?: number;
  readonly gasEndpointKrg?: number;
  readonly oilEndpointKro?: number;
  readonly gasCoreyExponent?: number;
  readonly oilCoreyExponent?: number;
};

export type RelativePermeabilityGasOilOutput = {
  readonly normalizedGasSaturation: number;
  readonly gasRelativePermeability: number;
  readonly oilRelativePermeability: number;
};

export const calculateRelativePermeabilityGasOil = (
  input: RelativePermeabilityGasOilInput,
): RelativePermeabilityGasOilOutput => {
  const residualGasSaturation = input.residualGasSaturation ?? 0;
  const residualOilSaturation = input.residualOilSaturation ?? 0;
  const gasEndpointKrg = input.gasEndpointKrg ?? 1;
  const oilEndpointKro = input.oilEndpointKro ?? 1;
  const gasCoreyExponent = input.gasCoreyExponent ?? 2;
  const oilCoreyExponent = input.oilCoreyExponent ?? 2;
  if (!(residualGasSaturation >= 0 && residualOilSaturation >= 0))
    simpleError(
      "residualGasSaturation",
      "Residual saturations must be non-negative.",
      "invalid_saturation",
    );
  const mobileRange = 1 - residualGasSaturation - residualOilSaturation;
  if (!(mobileRange > 0))
    simpleError(
      "residualOilSaturation",
      "Residual saturations must sum to less than one.",
      "invalid_saturation",
    );
  if (!(
    input.gasSaturation >= residualGasSaturation &&
    input.gasSaturation <= 1 - residualOilSaturation
  ))
    simpleError(
      "gasSaturation",
      "Gas saturation must lie between the residual endpoints.",
      "invalid_saturation",
    );
  for (const key of [
    "gasEndpointKrg",
    "oilEndpointKro",
    "gasCoreyExponent",
    "oilCoreyExponent",
  ] as const)
    if (!((input[key] as number) >= 0))
      simpleError(
        key,
        "Endpoints and exponents must be non-negative.",
        "invalid_exponent",
      );
  const normalizedGasSaturation =
    (input.gasSaturation - residualGasSaturation) / mobileRange;
  return {
    normalizedGasSaturation,
    gasRelativePermeability:
      gasEndpointKrg * normalizedGasSaturation ** gasCoreyExponent,
    oilRelativePermeability:
      oilEndpointKro * (1 - normalizedGasSaturation) ** oilCoreyExponent,
  };
};

export const relativePermeabilityGasOilExample = {
  input: {
    gasSaturation: 0.4,
    residualGasSaturation: 0.05,
    residualOilSaturation: 0.2,
  },
  output: {
    normalizedGasSaturation: 0.46666666666666673,
    gasRelativePermeability: 0.21777777777777785,
    oilRelativePermeability: 0.28444444444444433,
  },
} satisfies ToolExample<
  RelativePermeabilityGasOilInput,
  RelativePermeabilityGasOilOutput
>;

export const relativePermeabilityGasOilTool = createSimpleTool({
  id: "geology/relative-permeability-gas-oil",
  title: "Relative Permeability Gas Oil Calculator",
  description:
    "Compute Corey gas-oil relative permeabilities from gas saturation with residual saturations, Corey exponents and endpoint values.",
  inputs: [
    {
      description: "Gas saturation as a fraction.",
      id: "gasSaturation",
      kind: "number",
      label: "Sg",
      maximum: 1,
    },
    {
      default: 0,
      description: "Critical/residual gas saturation as a fraction.",
      id: "residualGasSaturation",
      kind: "number",
      label: "Sgr",
    },
    {
      default: 0,
      description: "Residual oil saturation to gas as a fraction.",
      id: "residualOilSaturation",
      kind: "number",
      label: "Sorg",
    },
    {
      default: 1,
      description: "Gas relative permeability endpoint krg°.",
      id: "gasEndpointKrg",
      kind: "number",
      label: "krg end point",
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
      description: "Gas Corey exponent ng.",
      id: "gasCoreyExponent",
      kind: "number",
      label: "ng",
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
      description: "Normalized gas saturation between zero and one.",
      id: "normalizedGasSaturation",
      kind: "number",
      label: "Sg*",
    },
    {
      description: "Gas relative permeability.",
      id: "gasRelativePermeability",
      kind: "number",
      label: "krg",
    },
    {
      description: "Oil relative permeability.",
      id: "oilRelativePermeability",
      kind: "number",
      label: "kro",
    },
  ],
  calculate: (input) =>
    calculateRelativePermeabilityGasOil(
      input as unknown as RelativePermeabilityGasOilInput,
    ),
});

export const runRelativePermeabilityGasOil =
  relativePermeabilityGasOilTool.execute;
export default relativePermeabilityGasOilTool;
