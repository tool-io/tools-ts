import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ coefficients: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ coefficients: H.polynomial(i.coefficients) });
};
export const example = {
  input: { coefficients: [1, 2, 0, 0] },
  output: { result: { coefficients: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Polynomial Coefficient Leading Zero Normalizer", "mathematics"],
    collections: ["data", "learn"],
    fields: ["polynomial", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "polynomial/coefficient-leading-zero-normalizer",
  title: "Polynomial Coefficient Leading Zero Normalizer",
  description:
    "Normalize leading-power zeros in ascending-power polynomial coefficients, preserving the zero polynomial as [0]; no approximate-zero pruning.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coefficients: { type: "array", items: { type: "number" } },
        },
        required: ["coefficients"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
