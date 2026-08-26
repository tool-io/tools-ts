import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PotentialSupportRatioPsrInput = {
  readonly workingAgePopulation15To64: number;
  readonly elderlyPopulation65Plus: number;
};

export type PotentialSupportRatioPsrOutput = {
  readonly potentialSupportRatio: number;
};

export const calculatePotentialSupportRatioPsr = (
  input: PotentialSupportRatioPsrInput,
): PotentialSupportRatioPsrOutput => {
  if (!(input.workingAgePopulation15To64 >= 0))
    return simpleError(
      "workingAgePopulation15To64",
      "Working-age population must be non-negative.",
      "invalid_population",
    );
  if (!(input.elderlyPopulation65Plus > 0))
    return simpleError(
      "elderlyPopulation65Plus",
      "Elderly population 65+ must be greater than zero.",
      "invalid_population",
    );
  return {
    potentialSupportRatio:
      input.workingAgePopulation15To64 / input.elderlyPopulation65Plus,
  };
};

export const potentialSupportRatioPsrExample = {
  input: { workingAgePopulation15To64: 6000, elderlyPopulation65Plus: 1500 },
  output: { potentialSupportRatio: 4 },
} satisfies ToolExample<
  PotentialSupportRatioPsrInput,
  PotentialSupportRatioPsrOutput
>;

export const potentialSupportRatioPsrTool = createSimpleTool({
  id: "demography/potential-support-ratio-psr",
  title: "Potential Support Ratio Calculator",
  description:
    "Compute the potential support ratio, the number of persons aged 15-64 per person aged 65 and over.",
  inputs: [
    {
      description: "Population aged 15-64 years.",
      id: "workingAgePopulation15To64",
      kind: "number",
      label: "Pop 15-64",
      minimum: 0,
    },
    {
      description: "Population aged 65 years and over.",
      id: "elderlyPopulation65Plus",
      kind: "number",
      label: "Pop 65+",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Working-age persons per elderly person.",
      id: "potentialSupportRatio",
      kind: "number",
      label: "PSR",
    },
  ],
  calculate: (input) =>
    calculatePotentialSupportRatioPsr(
      input as unknown as PotentialSupportRatioPsrInput,
    ),
});

export const runPotentialSupportRatioPsr = potentialSupportRatioPsrTool.execute;
export default potentialSupportRatioPsrTool;
