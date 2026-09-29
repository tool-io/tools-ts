import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  jointProbability: number;
  conditionProbability: number;
  base: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "jointProbability", label: "Joint probability", kind: "number" },
  {
    id: "conditionProbability",
    label: "Condition probability",
    kind: "number",
  },
  { id: "base", label: "Base", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.base > 1 &&
      i.conditionProbability > 0 &&
      i.conditionProbability <= 1 &&
      i.jointProbability > 0 &&
      i.jointProbability <= i.conditionProbability,
  );
  return H.finish({
    conditionalSurprisal:
      (Math.log(i.conditionProbability) - Math.log(i.jointProbability)) /
      Math.log(i.base),
  });
};
export const example = {
  input: { jointProbability: 0.125, conditionProbability: 0.5, base: 2 },
  output: { result: { conditionalSurprisal: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/conditional-surprisal-cell",
  title: "Information: Conditional Surprisal Cell Tool",
  description:
    "Compute one conditional surprisal from positive joint/conditioning probabilities and a declared logarithm base, without independence assumptions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalSurprisal: { type: "number" } },
        required: ["conditionalSurprisal"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
