import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { counts } from "../shared.js";

export type Input = Readonly<{
  readonly targetNames: readonly string[];
  readonly targetBases: readonly number[];
  readonly coveredBases: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingTargets: readonly string[];
  readonly missingTargetBases: number;
  readonly missingTargetCount: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.targetNames.length;
  counts(input.targetBases, "targetBases");
  counts(input.coveredBases, "coveredBases");
  if (
    n !== input.targetBases.length ||
    n !== input.coveredBases.length ||
    new Set(input.targetNames).size !== n ||
    input.targetBases.some((v, i) => v <= 0 || input.coveredBases[i] > v)
  )
    simpleError(
      "targetBases",
      "Distinct targets with positive lengths and covered bases within length required.",
    );
  const indexes = input.coveredBases.flatMap((v, i) => (v === 0 ? [i] : []));
  return {
    missingTargets: indexes.map((i) => input.targetNames[i]),
    missingTargetBases: indexes.reduce(
      (sum, i) => sum + input.targetBases[i],
      0,
    ),
    missingTargetCount: indexes.length,
  };
};
export const exampleInput = {
  targetNames: ["A", "B", "C"],
  targetBases: [100, 200, 100],
  coveredBases: [0, 50, 0],
} satisfies Input;
export const exampleOutput = {
  missingTargets: ["A", "C"],
  missingTargetBases: 200,
  missingTargetCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/zero-coverage-targets",
  title: "Zero Coverage Targets",
  description:
    "Tally target intervals with zero covered bases from supplied per-target coverage summaries.",
  inputs: [
    { id: "targetNames", label: "Target names", kind: "stringList" },
    { id: "targetBases", label: "Target bases", kind: "numberList" },
    { id: "coveredBases", label: "Covered bases", kind: "numberList" },
  ],
  outputs: [
    { id: "missingTargets", label: "Missing targets", kind: "stringList" },
    {
      id: "missingTargetBases",
      label: "Missing target bases",
      kind: "integer",
    },
    {
      id: "missingTargetCount",
      label: "Missing target count",
      kind: "integer",
    },
  ],
  calculate: (value) =>
    calculate({
      targetNames: value.targetNames as readonly string[],
      targetBases: value.targetBases as readonly number[],
      coveredBases: value.coveredBases as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
