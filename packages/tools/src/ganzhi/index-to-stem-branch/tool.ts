import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ ordinal: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ordinal", label: "Ordinal", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.ordinal, 1, 60);
  return H.finish({
    stemIndex: (i.ordinal - 1) % 10,
    branchIndex: (i.ordinal - 1) % 12,
  });
};
export const example = {
  input: { ordinal: 60 },
  output: { result: { stemIndex: 9, branchIndex: 11 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ganzhi/index-to-stem-branch",
  title: "Sexagenary Index to Stem-Branch Converter",
  description:
    "Decode a one-based sexagenary ordinal to zero-based Jia/Zi stem and branch indices; no date or year assignment.",
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
          branchIndex: { type: "number" },
          stemIndex: { type: "number" },
        },
        required: ["branchIndex", "stemIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
