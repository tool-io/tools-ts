import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PorePressurePredictionEatonResistivityInput = {
  readonly exponentN?: number;
  readonly normalPorePressureMegapascals: number;
  readonly normalShaleResistivityOhmMetres: number;
  readonly observedShaleResistivityOhmMetres: number;
  readonly overburdenStressMegapascals: number;
};

export type PorePressurePredictionEatonResistivityOutput = {
  readonly porePressureMegapascals: number;
};

export const calculatePorePressurePredictionEatonResistivity = (
  input: PorePressurePredictionEatonResistivityInput,
): PorePressurePredictionEatonResistivityOutput => {
  const exponent = input.exponentN ?? 0.6;
  if (!(input.overburdenStressMegapascals > 0))
    return simpleError(
      "overburdenStressMegapascals",
      "Overburden stress must be greater than zero.",
      "invalid_stress",
    );
  if (!(input.normalPorePressureMegapascals > 0))
    return simpleError(
      "normalPorePressureMegapascals",
      "Normal pore pressure must be greater than zero.",
      "invalid_stress",
    );
  if (input.normalPorePressureMegapascals > input.overburdenStressMegapascals)
    return simpleError(
      "normalPorePressureMegapascals",
      "Normal pore pressure cannot exceed the overburden stress.",
      "invalid_stress",
    );
  if (
    !(input.normalShaleResistivityOhmMetres > 0) ||
    !(input.observedShaleResistivityOhmMetres > 0)
  )
    return simpleError(
      "observedShaleResistivityOhmMetres",
      "Shale resistivities must be greater than zero.",
      "invalid_resistivity",
    );
  if (!(exponent > 0))
    return simpleError(
      "exponentN",
      "The Eaton exponent must be greater than zero.",
      "invalid_exponent",
    );
  return {
    porePressureMegapascals:
      input.overburdenStressMegapascals -
      (input.overburdenStressMegapascals -
        input.normalPorePressureMegapascals) *
        Math.pow(
          input.observedShaleResistivityOhmMetres /
            input.normalShaleResistivityOhmMetres,
          exponent,
        ),
  };
};

export const porePressurePredictionEatonResistivityExample = {
  input: {
    normalPorePressureMegapascals: 19.6,
    normalShaleResistivityOhmMetres: 4,
    observedShaleResistivityOhmMetres: 2,
    overburdenStressMegapascals: 45.1,
  },
  output: { porePressureMegapascals: 28.2762741376456 },
} satisfies ToolExample<
  PorePressurePredictionEatonResistivityInput,
  PorePressurePredictionEatonResistivityOutput
>;

export const porePressurePredictionEatonResistivityTool = createSimpleTool({
  id: "geology/pore-pressure-prediction-eaton-resistivity",
  title: "Pore Pressure Prediction Eaton Resistivity Calculator",
  description:
    "Predict formation pore pressure from shale resistivities with the Eaton resistivity method.",
  inputs: [
    {
      description:
        "Vertical stress above the depth of interest in megapascals.",
      id: "overburdenStressMegapascals",
      kind: "number",
      label: "Overburden stress",
    },
    {
      description: "Normal (hydrostatic) pore pressure in megapascals.",
      id: "normalPorePressureMegapascals",
      kind: "number",
      label: "Normal pore pressure",
    },
    {
      description:
        "Shale resistivity on the normal compaction trend in ohm metres.",
      id: "normalShaleResistivityOhmMetres",
      kind: "number",
      label: "Normal resistivity",
    },
    {
      description: "Observed shale resistivity in ohm metres.",
      id: "observedShaleResistivityOhmMetres",
      kind: "number",
      label: "Observed resistivity",
    },
    {
      default: 0.6,
      description: "Eaton resistivity exponent N.",
      id: "exponentN",
      kind: "number",
      label: "Exponent",
    },
  ],
  outputs: [
    {
      description: "Predicted pore pressure in megapascals.",
      id: "porePressureMegapascals",
      kind: "number",
      label: "Pore pressure",
    },
  ],
  calculate: (input) =>
    calculatePorePressurePredictionEatonResistivity(
      input as unknown as PorePressurePredictionEatonResistivityInput,
    ),
});

export const runPorePressurePredictionEatonResistivity =
  porePressurePredictionEatonResistivityTool.execute;
export default porePressurePredictionEatonResistivityTool;
