import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  sum,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly conflictScore: number;
  readonly noveltyScore: number;
  readonly impactScore: number;
  readonly callerWeights: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "conflictScore", label: "Conflict score", kind: "number" },
  { id: "noveltyScore", label: "Novelty score", kind: "number" },
  { id: "impactScore", label: "Impact score", kind: "number" },
  { id: "callerWeights", label: "Caller weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (i.callerWeights.length !== 3)
    simpleError("weights", "Three conflict/novelty/impact weights.");
  [i.conflictScore, i.noveltyScore, i.impactScore].forEach((v) =>
    fraction(v, "normalized score"),
  );
  i.callerWeights.forEach((v) => nonnegative(v, "weight"));
  const w = positive(sum(i.callerWeights), "total weight");
  return {
    callerWeightedScore:
      sum(
        [i.conflictScore, i.noveltyScore, i.impactScore].map(
          (v, j) => v * i.callerWeights[j],
        ),
      ) / w,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    conflictScore: 1,
    noveltyScore: 0,
    impactScore: 0.5,
    callerWeights: [1, 1, 2],
  },
  output: { result: { callerWeightedScore: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/conflict-novelty-impact-weighted-score",
  title: "Conflict Novelty Impact Weighted Score",
  description:
    "Caller normalized editorial factor weighted mean; not objective newsworthiness, factuality or public-interest determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { callerWeightedScore: { type: "number" } },
        required: ["callerWeightedScore"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
