import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly targetMatches: number;
  readonly decoyMatches: number;
  readonly decoyToTargetDatabaseRatio: number;
}>;
export type Output = Readonly<{
  readonly estimatedFalseTargets: number;
  readonly estimatedFdrPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.targetMatches) ||
    !Number.isSafeInteger(input.decoyMatches) ||
    input.targetMatches <= 0 ||
    input.decoyMatches < 0 ||
    input.decoyToTargetDatabaseRatio <= 0
  )
    simpleError(
      "targetMatches",
      "Positive target count and database-size ratio required.",
    );
  const estimatedFalseTargets =
    input.decoyMatches / input.decoyToTargetDatabaseRatio;
  return {
    estimatedFalseTargets,
    estimatedFdrPercent: (estimatedFalseTargets / input.targetMatches) * 100,
  };
};
export const exampleInput = {
  targetMatches: 100,
  decoyMatches: 2,
  decoyToTargetDatabaseRatio: 1,
} satisfies Input;
export const exampleOutput = {
  estimatedFalseTargets: 2,
  estimatedFdrPercent: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/target-decoy-fdr",
  title: "Target Decoy FDR",
  description:
    "Estimate target-decoy PSM false discovery rate using caller database-size ratio.",
  inputs: [
    { id: "targetMatches", label: "Target matches", kind: "number" },
    { id: "decoyMatches", label: "Decoy matches", kind: "number" },
    {
      id: "decoyToTargetDatabaseRatio",
      label: "Decoy to target database ratio",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "estimatedFalseTargets",
      label: "Estimated false targets",
      kind: "number",
    },
    {
      id: "estimatedFdrPercent",
      label: "Estimated fdr percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetMatches: value.targetMatches as number,
      decoyMatches: value.decoyMatches as number,
      decoyToTargetDatabaseRatio: value.decoyToTargetDatabaseRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
