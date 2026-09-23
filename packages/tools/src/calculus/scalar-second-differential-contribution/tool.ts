import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  secondDerivative: number;
  displacement: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "secondDerivative", label: "Second derivative", kind: "number" },
  { id: "displacement", label: "Displacement", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    secondDifferential: i.secondDerivative * i.displacement ** 2,
    quadraticTaylorContribution: 0.5 * i.secondDerivative * i.displacement ** 2,
  });
};
export const example = {
  input: { secondDerivative: 4, displacement: 0.5 },
  output: {
    result: { secondDifferential: 1, quadraticTaylorContribution: 0.5 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "calculus/scalar-second-differential-contribution",
  title: "Calculus: Scalar Second Differential Contribution Tool",
  description:
    "Distinguish a scalar second differential from its one-half-weighted quadratic Taylor contribution using an explicit supplied local second derivative.",
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
          quadraticTaylorContribution: { type: "number" },
          secondDifferential: { type: "number" },
        },
        required: ["quadraticTaylorContribution", "secondDifferential"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
