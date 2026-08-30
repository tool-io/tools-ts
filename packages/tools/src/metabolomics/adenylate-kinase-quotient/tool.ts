import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly adp: number;
  readonly atp: number;
  readonly amp: number;
  readonly targetQuotient: number;
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly massActionQuotient: number;
  readonly equilibriumMatch: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.atp <= 0 ||
    input.amp <= 0 ||
    input.adp < 0 ||
    input.targetQuotient < 0 ||
    input.tolerance < 0
  )
    simpleError("atp", "Positive ATP/AMP and nonnegative parameters required.");
  const massActionQuotient = input.adp ** 2 / (input.atp * input.amp);
  return {
    massActionQuotient,
    equilibriumMatch:
      Math.abs(massActionQuotient - input.targetQuotient) <= input.tolerance,
  };
};
export const exampleInput = {
  adp: 2,
  atp: 2,
  amp: 2,
  targetQuotient: 1,
  tolerance: 0,
} satisfies Input;
export const exampleOutput = {
  massActionQuotient: 1,
  equilibriumMatch: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/adenylate-kinase-quotient",
  title: "Adenylate Kinase Quotient",
  description:
    "Check adenylate kinase mass-action quotient against an injected equilibrium value.",
  inputs: [
    { id: "adp", kind: "number", label: "Adp" },
    { id: "atp", kind: "number", label: "Atp" },
    { id: "amp", kind: "number", label: "Amp" },
    { id: "targetQuotient", kind: "number", label: "Target quotient" },
    { id: "tolerance", kind: "number", label: "Tolerance" },
  ],
  outputs: [
    { id: "massActionQuotient", kind: "number", label: "Mass action quotient" },
    { id: "equilibriumMatch", kind: "boolean", label: "Equilibrium match" },
  ],
  calculate: (value) =>
    calculate({
      adp: value.adp as number,
      atp: value.atp as number,
      amp: value.amp as number,
      targetQuotient: value.targetQuotient as number,
      tolerance: value.tolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
