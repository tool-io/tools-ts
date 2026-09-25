import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  timeConstant: number;
  samplePeriod: number;
  discretization: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "timeConstant", label: "Time constant", kind: "number" },
  { id: "samplePeriod", label: "Sample period", kind: "number" },
  {
    id: "discretization",
    label: "Discretization",
    kind: "string",
    enum: ["backward-euler", "exact-decay"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.timeConstant);
  H.positive(i.samplePeriod);
  H.choice(i.discretization, ["backward-euler", "exact-decay"]);
  return H.finish({
    previousOutputWeight:
      i.discretization === "backward-euler"
        ? i.timeConstant / (i.timeConstant + i.samplePeriod)
        : Math.exp(-i.samplePeriod / i.timeConstant),
  });
};
export const example = {
  input: { timeConstant: 1, samplePeriod: 1, discretization: "backward-euler" },
  output: { result: { previousOutputWeight: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cybernetics/derivative-filter-coefficient-reference",
  title: "Cybernetics: Derivative Filter Coefficient Reference Tool",
  description:
    "Return the previous-output coefficient for a first-order low-pass derivative filter under explicit backward-Euler or exact-decay discretization; not controller tuning or a control loop.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { previousOutputWeight: { type: "number" } },
        required: ["previousOutputWeight"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
