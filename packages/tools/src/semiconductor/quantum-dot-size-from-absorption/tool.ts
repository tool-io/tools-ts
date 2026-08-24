import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type QuantumDotSizeFromAbsorptionInput = {
  readonly firstExcitonAbsorptionPeakNm: number;
};

export type QuantumDotSizeFromAbsorptionOutput = {
  readonly diameterNm: number;
};

export const quantumDotSizeFromAbsorptionExample = {
  input: { firstExcitonAbsorptionPeakNm: 500 },
  output: { diameterNm: 2.3449999999999207 },
} satisfies ToolExample<
  QuantumDotSizeFromAbsorptionInput,
  QuantumDotSizeFromAbsorptionOutput
>;

export const calculateQuantumDotSizeFromAbsorption = (
  input: QuantumDotSizeFromAbsorptionInput,
): QuantumDotSizeFromAbsorptionOutput => {
  const wavelength = input.firstExcitonAbsorptionPeakNm;
  return {
    diameterNm:
      1.6122e-9 * wavelength ** 4 -
      2.6575e-6 * wavelength ** 3 +
      1.6242e-3 * wavelength ** 2 -
      0.4277 * wavelength +
      41.57,
  };
};

export const quantumDotSizeFromAbsorptionTool = createSimpleTool({
  calculate: (input) => {
    return calculateQuantumDotSizeFromAbsorption({
      firstExcitonAbsorptionPeakNm:
        input.firstExcitonAbsorptionPeakNm as number,
    });
  },
  description:
    "Estimate CdSe quantum-dot diameter from the first excitonic absorption peak using the Yu empirical fit; photoluminescence emission peaks are not interchangeable with this calibration.",
  id: "semiconductor/quantum-dot-size-from-absorption",
  inputs: [
    {
      description:
        "Wavelength of the first excitonic absorption peak, not the photoluminescence emission maximum.",
      id: "firstExcitonAbsorptionPeakNm",
      kind: "number",
      label: "First exciton absorption peak",
      maximum: 650,
      minimum: 400,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Empirical CdSe nanocrystal diameter.",
      id: "diameterNm",
      kind: "number",
      label: "Diameter",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  title: "CdSe Quantum Dot Diameter from Absorption Peak",
});
export const runQuantumDotSizeFromAbsorption =
  quantumDotSizeFromAbsorptionTool.execute;
export default quantumDotSizeFromAbsorptionTool;
