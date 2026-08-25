import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ForestaySagInput = {
  stayLengthMeters: number;
  tensionNewtons: number;
  transverseLoadPerMeterKg: number;
};

export type ForestaySagOutput = {
  sagMeters: number;
};

const GRAVITY_MS2 = 9.80665;

export const forestaySagExample = {
  input: {
    stayLengthMeters: 10,
    tensionNewtons: 500,
    transverseLoadPerMeterKg: 1,
  },
  output: { sagMeters: 0.24516625 },
} satisfies ToolExample<ForestaySagInput, ForestaySagOutput>;

export const calculateForestaySag = (
  input: ForestaySagInput,
): ForestaySagOutput => {
  if (input.stayLengthMeters <= 0)
    simpleError(
      "stayLengthMeters",
      "Stay length must be positive.",
      "invalid_input",
    );
  if (input.tensionNewtons <= 0)
    simpleError("tensionNewtons", "Tension must be positive.", "invalid_input");
  return {
    sagMeters:
      (input.transverseLoadPerMeterKg *
        GRAVITY_MS2 *
        input.stayLengthMeters *
        input.stayLengthMeters) /
      (8 * input.tensionNewtons),
  };
};

export const forestaySagTool = createSimpleTool({
  calculate: (input) =>
    calculateForestaySag(input as unknown as ForestaySagInput),
  description:
    "Compute forestay sag with the parabolic approximation sagMeters = transverseLoadPerMeterKg * 9.80665 * stayLengthMeters^2 / (8 * tensionNewtons).",
  id: "sailing/forestay-sag",
  inputs: [
    {
      description: "Transverse load per unit length of the stay.",
      id: "transverseLoadPerMeterKg",
      kind: "number",
      label: "Transverse load",
      minimum: 0,
      unit: "kg/m",
    },
    {
      description: "Length of the forestay.",
      id: "stayLengthMeters",
      kind: "number",
      label: "Stay length",
      minimum: 0,
      unit: "m",
    },
    {
      description: "Tension in the forestay.",
      id: "tensionNewtons",
      kind: "number",
      label: "Tension",
      minimum: 0,
      unit: "N",
    },
  ],
  outputs: [
    {
      description: "Midspan sag of the forestay.",
      format: "length-m",
      id: "sagMeters",
      kind: "number",
      label: "Sag",
      unit: "m",
    },
  ],
  title: "Forestay Sag Calculator",
});
export const runForestaySag = forestaySagTool.execute;
export default forestaySagTool;
