import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InbreedingPedigreeInput = {
  readonly generationsBackPath: number;
  readonly parentalInbreedingF?: number;
};

export type InbreedingPedigreeOutput = {
  readonly inbreedingCoefficientPath: number;
};

export const inbreedingPedigreeExample = {
  input: { generationsBackPath: 2 },
  output: { inbreedingCoefficientPath: 0.125 },
} satisfies ToolExample<InbreedingPedigreeInput, InbreedingPedigreeOutput>;

export const inbreedingPedigreeTool = createSimpleTool({
  id: "biology/inbreeding-pedigree",
  title: "Pedigree Inbreeding Loop",
  description:
    "Compute the path contribution to an offspring inbreeding coefficient for one common ancestor loop.",
  inputs: [
    {
      description:
        "Number of generations from the sire to the common ancestor plus dam to the common ancestor.",
      id: "generationsBackPath",
      label: "Generations through the loop",
      kind: "integer",
    },
    {
      default: 0,
      id: "parentalInbreedingF",
      label: "Common ancestor inbreeding",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "inbreedingCoefficientPath",
      label: "Inbreeding coefficient path contribution",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const generationsBackPath = input.generationsBackPath as number;
    if (!(generationsBackPath >= 1))
      simpleError(
        "generationsBackPath",
        "Loop path length must be an integer of at least one.",
        "invalid_path",
      );
    return {
      inbreedingCoefficientPath:
        Math.pow(0.5, generationsBackPath + 1) *
        (1 + (input.parentalInbreedingF as number)),
    };
  },
});
export const runInbreedingPedigree = inbreedingPedigreeTool.execute;
export default inbreedingPedigreeTool;
