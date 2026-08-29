import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FluorescenceQuantumYieldInput = {
  readonly quantumYieldReference: number;
  readonly integralSample: number;
  readonly integralReference: number;
  readonly refractiveIndexSample: number;
  readonly refractiveIndexReference: number;
};

export type FluorescenceQuantumYieldOutput = {
  readonly quantumYieldSample: number;
};

export const fluorescenceQuantumYieldExample = {
  input: {
    quantumYieldReference: 0.5,
    integralSample: 1500,
    integralReference: 3000,
    refractiveIndexSample: 1.33,
    refractiveIndexReference: 1.33,
  },
  output: { quantumYieldSample: 0.25 },
} satisfies ToolExample<
  FluorescenceQuantumYieldInput,
  FluorescenceQuantumYieldOutput
>;

export const fluorescenceQuantumYieldTool = createSimpleTool({
  id: "chemistry/spectroscopy-fluorescence-quantum-yield",
  title: "Fluorescence QY Compare",
  description:
    "Estimate the sample fluorescence quantum yield relative to a reference standard.",
  inputs: [
    {
      id: "quantumYieldReference",
      label: "Reference quantum yield",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    { id: "integralSample", label: "Sample integral", kind: "number" },
    { id: "integralReference", label: "Reference integral", kind: "number" },
    {
      id: "refractiveIndexSample",
      label: "Sample refractive index",
      kind: "number",
    },
    {
      id: "refractiveIndexReference",
      label: "Reference refractive index",
      kind: "number",
    },
  ],
  outputs: [
    { id: "quantumYieldSample", label: "Sample quantum yield", kind: "number" },
  ],
  calculate: (input) => {
    const integralSample = input.integralSample as number;
    const integralReference = input.integralReference as number;
    const refractiveIndexSample = input.refractiveIndexSample as number;
    const refractiveIndexReference = input.refractiveIndexReference as number;
    if (!(integralSample > 0))
      simpleError("integralSample", "Sample integral must be positive.");
    if (!(integralReference > 0))
      simpleError("integralReference", "Reference integral must be positive.");
    if (!(refractiveIndexSample > 0))
      simpleError(
        "refractiveIndexSample",
        "Sample refractive index must be positive.",
      );
    if (!(refractiveIndexReference > 0))
      simpleError(
        "refractiveIndexReference",
        "Reference refractive index must be positive.",
      );
    return {
      quantumYieldSample:
        (input.quantumYieldReference as number) *
        (integralSample / integralReference) *
        Math.pow(refractiveIndexSample / refractiveIndexReference, 2),
    };
  },
});
export const runFluorescenceQuantumYield = fluorescenceQuantumYieldTool.execute;
export default fluorescenceQuantumYieldTool;
