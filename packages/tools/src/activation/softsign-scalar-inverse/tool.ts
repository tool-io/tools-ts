import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ y: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "y", label: "Y", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(Math.abs(i.y) < 1);
  return H.finish({ x: i.y / (1 - Math.abs(i.y)) });
};
export const example = {
  input: { y: 0.5 },
  output: { result: { x: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/softsign-scalar-inverse",
  title: "Activation: Softsign Scalar Inverse Tool",
  description:
    "Invert scalar softsign y=x/(1+abs(x)) only inside its open range (-1,1).",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { x: { type: "number" } },
        required: ["x"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
