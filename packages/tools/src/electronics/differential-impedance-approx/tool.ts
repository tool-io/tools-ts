import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DifferentialImpedanceApproxInput = {
  readonly gapMm: number;
  readonly heightMm: number;
  readonly microstripSingleOhms: number;
};

export type DifferentialImpedanceApproxOutput = {
  readonly differentialImpedanceOhms: number;
};

export const differentialImpedanceApproxExample = {
  input: { gapMm: 0.2, heightMm: 1.6, microstripSingleOhms: 50 },
  output: { differentialImpedanceOhms: 57.42781903757644 },
} satisfies ToolExample<
  DifferentialImpedanceApproxInput,
  DifferentialImpedanceApproxOutput
>;

export const calculateDifferentialImpedanceApprox = (
  input: DifferentialImpedanceApproxInput,
): DifferentialImpedanceApproxOutput => {
  if (!(input.microstripSingleOhms > 0))
    simpleError(
      "microstripSingleOhms",
      "Single-ended impedance must be positive.",
      "invalid_impedance",
    );
  if (!(input.gapMm > 0))
    simpleError("gapMm", "Gap must be positive.", "invalid_gap");
  if (!(input.heightMm > 0))
    simpleError("heightMm", "Height must be positive.", "invalid_height");
  return {
    differentialImpedanceOhms:
      2 *
      input.microstripSingleOhms *
      (1 - 0.48 * Math.exp((-0.96 * input.gapMm) / input.heightMm)),
  };
};

export const differentialImpedanceApproxTool = createSimpleTool({
  calculate: (input) =>
    calculateDifferentialImpedanceApprox(
      input as unknown as DifferentialImpedanceApproxInput,
    ),
  description:
    "Approximate edge-coupled differential impedance as 2 x z0 x (1 - 0.48 x exp(-0.96 x s / h)).",
  id: "electronics/differential-impedance-approx",
  inputs: [
    { id: "gapMm", kind: "number", label: "Edge-to-edge gap", unit: "mm" },
    { id: "heightMm", kind: "number", label: "Substrate height", unit: "mm" },
    {
      id: "microstripSingleOhms",
      kind: "number",
      label: "Single-ended impedance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      id: "differentialImpedanceOhms",
      kind: "number",
      label: "Differential impedance",
      unit: "Ω",
    },
  ],
  title: "Differential Z Approx",
});
export const runDifferentialImpedanceApprox =
  differentialImpedanceApproxTool.execute;
export default differentialImpedanceApproxTool;
