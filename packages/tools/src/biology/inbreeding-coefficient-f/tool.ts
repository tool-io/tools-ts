import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InbreedingCoefficientFInput = {
  readonly observedHeterozygosity: number;
  readonly expectedHeterozygosity: number;
};

export type InbreedingCoefficientFOutput = {
  readonly inbreedingCoefficientF: number;
};

export const inbreedingCoefficientFExample = {
  input: { observedHeterozygosity: 0.3, expectedHeterozygosity: 0.42 },
  output: { inbreedingCoefficientF: 0.2857142857142857 },
} satisfies ToolExample<
  InbreedingCoefficientFInput,
  InbreedingCoefficientFOutput
>;

export const inbreedingCoefficientFTool = createSimpleTool({
  id: "biology/inbreeding-coefficient-f",
  title: "Inbreeding Coefficient",
  description:
    "Compute the inbreeding coefficient f = (he - ho) / he, which may be negative when heterozygote excess occurs.",
  inputs: [
    {
      id: "observedHeterozygosity",
      label: "Observed heterozygosity",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "expectedHeterozygosity",
      label: "Expected heterozygosity",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "inbreedingCoefficientF",
      label: "Inbreeding coefficient F",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const expectedHeterozygosity = input.expectedHeterozygosity as number;
    if (!(expectedHeterozygosity > 0))
      simpleError(
        "expectedHeterozygosity",
        "Expected heterozygosity must be positive.",
      );
    return {
      inbreedingCoefficientF:
        (expectedHeterozygosity - (input.observedHeterozygosity as number)) /
        expectedHeterozygosity,
    };
  },
});
export const runInbreedingCoefficientF = inbreedingCoefficientFTool.execute;
export default inbreedingCoefficientFTool;
