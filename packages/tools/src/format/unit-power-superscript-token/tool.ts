import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ unit: string; exponent: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "unit", label: "Unit", kind: "string" },
  { id: "exponent", label: "Exponent", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[A-Za-zµΩ]+(?![\s\S])/.test(i.unit));
  H.int(i.exponent, -999, 999);
  const sup: Record<string, string> = {
    "-": "⁻",
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };
  return H.finish({
    label:
      i.unit +
      (i.exponent === 1
        ? ""
        : Array.from(String(i.exponent))
            .map((c) => sup[c])
            .join("")),
  });
};
export const example = {
  input: { unit: "m", exponent: -2 },
  output: { result: { label: "m\u207b\u00b2" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/unit-power-superscript-token",
  title: "Formatting: Unit Power Superscript Token Tool",
  description:
    "Format one opaque unit token with an integer Unicode superscript power, omitting exponent one; does not simplify units or infer dimensional equivalence.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" } },
        required: ["label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
