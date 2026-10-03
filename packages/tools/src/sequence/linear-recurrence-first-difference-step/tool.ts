import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  state: readonly number[];
  coefficients: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "state", label: "State", kind: "numberList" },
  { id: "coefficients", label: "Coefficients", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.state.length > 0 && i.state.length === i.coefficients.length);
  const next = i.state.reduce((s, x, j) => s + x * i.coefficients[j], 0);
  return H.finish({
    nextValue: next,
    firstDifference: next - i.state[i.state.length - 1],
    nextState: [...i.state.slice(1), next],
  });
};
export const example = {
  input: { state: [2, 3], coefficients: [1, 1] },
  output: { result: { nextValue: 5, firstDifference: 2, nextState: [3, 5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sequence/linear-recurrence-first-difference-step",
  title: "Sequence: Linear Recurrence First Difference Step Tool",
  description:
    "Advance one short real linear recurrence with oldest-to-newest state and matching coefficient order, returning next state and its first difference; no symbolic recurrence solving.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstDifference: { type: "number" },
          nextState: { type: "array", items: { type: "number" } },
          nextValue: { type: "number" },
        },
        required: ["firstDifference", "nextState", "nextValue"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
