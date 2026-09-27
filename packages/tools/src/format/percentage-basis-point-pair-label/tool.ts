import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ fraction: number; digits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fraction", label: "Fraction", kind: "number" },
  { id: "digits", label: "Digits", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.digits, 0, 12);
  H.check(Math.abs(i.fraction) <= 1e12);
  return H.finish({
    label:
      (i.fraction * 100).toFixed(i.digits) +
      "% (" +
      (i.fraction * 10000).toFixed(i.digits) +
      " bp)",
  });
};
export const example = {
  input: { fraction: 0.0125, digits: 2 },
  output: { result: { label: "1.25% (125.00 bp)" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/percentage-basis-point-pair-label",
  title: "Formatting: Percentage Basis Point Pair Label Tool",
  description:
    "Display one fractional rate as paired percent and basis-point labels at explicit fixed decimal precision; no rate conversion model or locale inference.",
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
