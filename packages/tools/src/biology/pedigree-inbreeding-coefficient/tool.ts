import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PedigreeInbreedingCoefficientInput = {
  readonly fBase?: number;
  readonly pathContribution: number;
};

export type PedigreeInbreedingCoefficientOutput = {
  readonly accumulatedInbreedingF: number;
};

export const pedigreeInbreedingCoefficientExample = {
  input: { fBase: 0.125, pathContribution: 0.25 },
  output: { accumulatedInbreedingF: 0.34375 },
} satisfies ToolExample<
  PedigreeInbreedingCoefficientInput,
  PedigreeInbreedingCoefficientOutput
>;

export const pedigreeInbreedingCoefficientTool = createSimpleTool({
  id: "biology/pedigree-inbreeding-coefficient",
  title: "Pedigree F Accumulated",
  description:
    "Accumulate an inbreeding coefficient as the base coefficient plus the remaining relationship budget times one path contribution.",
  inputs: [
    {
      default: 0,
      description: "Base inbreeding coefficient already accumulated.",
      id: "fBase",
      label: "Base F",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Contribution of one common ancestor path.",
      id: "pathContribution",
      label: "Path contribution",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "accumulatedInbreedingF",
      label: "Accumulated inbreeding F",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const fBase = input.fBase as number;
    const accumulatedInbreedingF =
      fBase + (1 - fBase) * (input.pathContribution as number);
    return {
      accumulatedInbreedingF: Math.min(1, Math.max(0, accumulatedInbreedingF)),
    };
  },
});
export const runPedigreeInbreedingCoefficient =
  pedigreeInbreedingCoefficientTool.execute;
export default pedigreeInbreedingCoefficientTool;
