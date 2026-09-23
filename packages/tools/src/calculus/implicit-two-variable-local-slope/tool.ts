import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ partialX: number; partialY: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "partialX", label: "Partial x", kind: "number" },
  { id: "partialY", label: "Partial y", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.partialY !== 0);
  return H.finish({ slope: -i.partialX / i.partialY });
};
export const example = {
  input: { partialX: 2, partialY: 4 },
  output: { result: { slope: -0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "calculus/implicit-two-variable-local-slope",
  title: "Calculus: Implicit Two Variable Local Slope Tool",
  description:
    "Compute the implicit tangent slope -Fx/Fy from already evaluated local partials, rejecting vertical/undefined slopes.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { slope: { type: "number" } },
        required: ["slope"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
