import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ thirdDerivative: number; step: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "thirdDerivative", label: "Third derivative", kind: "number" },
  { id: "step", label: "Step", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.step);
  return H.finish({
    leadingCentralDifferenceError: (i.thirdDerivative * i.step * i.step) / 6,
  });
};
export const example = {
  input: { thirdDerivative: 6, step: 0.1 },
  output: { result: { leadingCentralDifferenceError: 0.01 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "calculus/scalar-central-difference-error-term",
  title: "Calculus: Scalar Central Difference Error Term Tool",
  description:
    "Return the leading f-third*h^2/6 truncation term of a symmetric first-derivative difference under caller-established smoothness; not an error bound or derivative estimator.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { leadingCentralDifferenceError: { type: "number" } },
        required: ["leadingCentralDifferenceError"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
