import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coefficients: readonly number[];
  modulusPower: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
  { id: "modulusPower", label: "modulusPower", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.coefficients.length > 0);
  H.int(i.modulusPower, 1, 128);
  return H.finish({
    remainder: i.coefficients.slice(0, i.modulusPower),
    quotient:
      i.coefficients.length > i.modulusPower
        ? i.coefficients.slice(i.modulusPower)
        : [0],
  });
};
export const example = {
  input: { coefficients: [1, 2, 3], modulusPower: 2 },
  output: { result: { remainder: [1, 2], quotient: [3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Polynomial Low Power Remainder", "mathematics"],
    collections: ["data", "learn"],
    fields: ["polynomial", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "polynomial/coefficient-low-power-remainder",
  title: "Polynomial Low Power Remainder",
  description:
    "Split ascending polynomial coefficients into remainder modulo x^k and quotient by x^k; not general polynomial long division.",
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
          remainder: { type: "array", items: { type: "number" } },
          quotient: { type: "array", items: { type: "number" } },
        },
        required: ["remainder", "quotient"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
