import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  x: number;
  beta: number;
  switchThreshold: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "beta", label: "Beta", kind: "number" },
  { id: "switchThreshold", label: "Switch threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.beta);
  H.check(i.switchThreshold >= 0);
  return H.finish({
    scaledInput: i.beta * i.x,
    useLinearTail: i.beta * i.x > i.switchThreshold,
  });
};
export const example = {
  input: { x: 10, beta: 2, switchThreshold: 20 },
  output: { result: { scaledInput: 20, useLinearTail: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/softplus-linear-tail-switch",
  title: "Activation: Softplus Linear Tail Switch Tool",
  description:
    "Report the strict numerical linear-tail decision for an explicitly beta-scaled softplus implementation; this is a branch diagnostic, not a second activation approximation.",
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
          scaledInput: { type: "number" },
          useLinearTail: { type: "boolean" },
        },
        required: ["scaledInput", "useLinearTail"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
