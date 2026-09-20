import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ value: number; gate: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "number" },
  { id: "gate", label: "Gate", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const s = H.sigmoid(i.gate);
  return H.finish({ valuePartial: s, gatePartial: i.value * s * (1 - s) });
};
export const example = {
  input: { value: 4, gate: 0 },
  output: { result: { valuePartial: 0.5, gatePartial: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/glu-gate-partial-derivative",
  title: "Activation: Glu Gate Partial Derivative Tool",
  description:
    "Return both local partial derivatives of value*sigmoid(gate), not an automatic-differentiation engine.",
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
          gatePartial: { type: "number" },
          valuePartial: { type: "number" },
        },
        required: ["gatePartial", "valuePartial"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
