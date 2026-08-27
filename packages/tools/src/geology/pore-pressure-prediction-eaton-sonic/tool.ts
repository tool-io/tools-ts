import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PorePressurePredictionEatonSonicInput = {
  readonly exponentN?: number;
  readonly normalPorePressureMegapascals: number;
  readonly normalSonicMicrosecondsPerMetre: number;
  readonly observedSonicMicrosecondsPerMetre: number;
  readonly overburdenStressMegapascals: number;
};

export type PorePressurePredictionEatonSonicOutput = {
  readonly porePressureMegapascals: number;
};

export const calculatePorePressurePredictionEatonSonic = (
  input: PorePressurePredictionEatonSonicInput,
): PorePressurePredictionEatonSonicOutput => {
  const exponent = input.exponentN ?? 3;
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
    !(input.normalSonicMicrosecondsPerMetre > 0) ||
    !(input.observedSonicMicrosecondsPerMetre > 0)
  )
    return simpleError(
      "observedSonicMicrosecondsPerMetre",
      "Sonic travel times must be greater than zero.",
      "invalid_sonic",
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
          input.normalSonicMicrosecondsPerMetre /
            input.observedSonicMicrosecondsPerMetre,
          exponent,
        ),
  };
};

export const porePressurePredictionEatonSonicExample = {
  input: {
    normalPorePressureMegapascals: 19.6,
    normalSonicMicrosecondsPerMetre: 200,
    observedSonicMicrosecondsPerMetre: 250,
    overburdenStressMegapascals: 45.1,
  },
  output: { porePressureMegapascals: 32.044 },
} satisfies ToolExample<
  PorePressurePredictionEatonSonicInput,
  PorePressurePredictionEatonSonicOutput
>;

export const porePressurePredictionEatonSonicTool = createSimpleTool({
  id: "geology/pore-pressure-prediction-eaton-sonic",
  title: "Pore Pressure Prediction Eaton Sonic Calculator",
  description:
    "Predict formation pore pressure from compressional sonic travel times with the Eaton sonic method.",
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
        "Sonic travel time on the normal compaction trend in microseconds per metre.",
      id: "normalSonicMicrosecondsPerMetre",
      kind: "number",
      label: "Normal sonic",
    },
    {
      description:
        "Observed shale sonic travel time in microseconds per metre.",
      id: "observedSonicMicrosecondsPerMetre",
      kind: "number",
      label: "Observed sonic",
    },
    {
      default: 3,
      description: "Eaton sonic exponent N.",
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
    calculatePorePressurePredictionEatonSonic(
      input as unknown as PorePressurePredictionEatonSonicInput,
    ),
});

export const runPorePressurePredictionEatonSonic =
  porePressurePredictionEatonSonicTool.execute;
export default porePressurePredictionEatonSonicTool;
