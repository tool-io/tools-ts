import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
import { softplusTool } from "../softplus/tool.js";
import { tanhTool } from "../tanh/tool.js";
export type Input = Readonly<{ x: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const softplus = softplusTool.execute({ x: i.x });
  if (!softplus.ok) throw new Error("Softplus calculation failed");
  const tanh = tanhTool.execute({ x: H.number(softplus.output.y) });
  if (!tanh.ok) throw new Error("Tanh calculation failed");
  const t = H.number(tanh.output.y),
    s = i.x * H.sigmoid(i.x);
  return H.finish({ derivative: t + s * (1 - t * t) });
};
export const example = {
  input: { x: 0 },
  output: { result: { derivative: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/mish-scalar-derivative",
  title: "Activation: Mish Scalar Derivative Tool",
  description:
    "Evaluate the scalar Mish derivative for x*tanh(softplus(x)) using stable softplus/sigmoid branches; no tensor differentiation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
