import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ degree: number; index: number; t: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "degree", label: "Degree", kind: "integer" },
  { id: "index", label: "Index", kind: "integer" },
  { id: "t", label: "T", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.degree, 0, 64);
  H.int(i.index, 0, i.degree);
  H.bounded(i.t, 0, 1);
  const coefficient = Number(
    H.factorial(i.degree) /
      (H.factorial(i.index) * H.factorial(i.degree - i.index)),
  );
  return H.finish({
    basisValue:
      coefficient * i.t ** i.index * (1 - i.t) ** (i.degree - i.index),
  });
};
export const example = {
  input: { degree: 3, index: 1, t: 0.5 },
  output: { result: { basisValue: 0.375 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/bernstein-basis-single-index",
  title: "Interpolation: Bernstein Basis Single Index Tool",
  description:
    "Evaluate one bounded-degree Bernstein basis with exact combinatorial coefficient and explicit endpoint powers, including degree-zero constant basis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { basisValue: { type: "number" } },
        required: ["basisValue"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
