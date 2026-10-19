import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
  degree: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "left", label: "left", kind: "numberList" },
  { id: "right", label: "right", kind: "numberList" },
  { id: "degree", label: "degree", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.degree, 0, 127);
  return H.finish({
    coefficients: H.polyProduct(i.left, i.right).slice(0, i.degree + 1),
  });
};
export const example = {
  input: { left: [1, 2], right: [3, 4], degree: 1 },
  output: { result: { coefficients: [3, 10] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Polynomial Truncated Coefficient Product", "mathematics"],
    collections: ["data", "learn"],
    fields: ["polynomial", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "polynomial/coefficient-truncated-product",
  title: "Polynomial Truncated Coefficient Product",
  description:
    "Return polynomial product coefficients only through an explicit maximum power, equivalent to reduction modulo x^(degree+1); no coefficient rounding.",
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
