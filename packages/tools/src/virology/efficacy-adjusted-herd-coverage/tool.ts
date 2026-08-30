import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly reproductionNumber: number;
  readonly vaccineEfficacyFraction: number;
}>;
export type Output = Readonly<{
  readonly herdImmunityFraction: number;
  readonly requiredCoverageFraction: number;
  readonly feasibleAtFullCoverage: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.reproductionNumber, "reproductionNumber");
  fraction(input.vaccineEfficacyFraction, "vaccineEfficacyFraction");
  positive(input.vaccineEfficacyFraction, "vaccineEfficacyFraction");
  const herdImmunityFraction = Math.max(0, 1 - 1 / input.reproductionNumber),
    requiredCoverageFraction =
      herdImmunityFraction / input.vaccineEfficacyFraction;
  return {
    herdImmunityFraction,
    requiredCoverageFraction,
    feasibleAtFullCoverage: requiredCoverageFraction <= 1,
  };
};
export const exampleInput = {
  reproductionNumber: 4,
  vaccineEfficacyFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  herdImmunityFraction: 0.75,
  requiredCoverageFraction: 0.9375,
  feasibleAtFullCoverage: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/efficacy-adjusted-herd-coverage",
  title: "Efficacy Adjusted Herd Coverage",
  description:
    "Estimate critical vaccine coverage under homogeneous immunity and a supplied effective vaccine efficacy; values above one indicate model infeasibility.",
  inputs: [
    { id: "reproductionNumber", label: "Reproduction number", kind: "number" },
    {
      id: "vaccineEfficacyFraction",
      label: "Vaccine efficacy fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "herdImmunityFraction",
      label: "Herd immunity fraction",
      kind: "number",
    },
    {
      id: "requiredCoverageFraction",
      label: "Required coverage fraction",
      kind: "number",
    },
    {
      id: "feasibleAtFullCoverage",
      label: "Feasible at full coverage",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      reproductionNumber: value.reproductionNumber as number,
      vaccineEfficacyFraction: value.vaccineEfficacyFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
