import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch39-shared.js";
export type Input = Readonly<{ readonly independentRebaGrandScore: number }>;
export type Output = Readonly<{
  readonly actionLevel: number;
  readonly riskCategory: string;
}>;
const inputFields = [
  {
    id: "independentRebaGrandScore",
    label: "Independent reba grand score",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.independentRebaGrandScore, "REBA", 1, 15);
  const s = input.independentRebaGrandScore;
  return {
    actionLevel: s === 1 ? 0 : s <= 3 ? 1 : s <= 7 ? 2 : s <= 10 ? 3 : 4,
    riskCategory:
      s === 1
        ? "negligible"
        : s <= 3
          ? "low"
          : s <= 7
            ? "medium"
            : s <= 10
              ? "high"
              : "very high",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { independentRebaGrandScore: 5 } satisfies Input;
export const exampleOutput = {
  actionLevel: 2,
  riskCategory: "medium",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/reba-grand-risk-mapper",
  title: "REBA Grand Score Risk Category Mapper",
  description:
    "Named REBA score/action band mapping only, independent full score required, not operational work-safety decision. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "actionLevel", label: "Action level", kind: "number" },
    { id: "riskCategory", label: "Risk category", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      independentRebaGrandScore: value.independentRebaGrandScore as number,
    }),
});
export const run = tool.execute;
export default tool;
