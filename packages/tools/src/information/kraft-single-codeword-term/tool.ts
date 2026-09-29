import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ length: number; radix: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", label: "Length", kind: "integer" },
  { id: "radix", label: "Radix", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 0, 1000);
  H.int(i.radix, 2, 1000000);
  return H.finish({
    kraftContribution: Math.exp(-i.length * Math.log(i.radix)),
  });
};
export const example = {
  input: { length: 3, radix: 2 },
  output: { result: { kraftContribution: 0.125 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/kraft-single-codeword-term",
  title: "Information: Kraft Single Codeword Term Tool",
  description:
    "Compute one radix^-length Kraft-sum term for an explicit codeword length; a single term does not certify a whole codebook.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { kraftContribution: { type: "number" } },
        required: ["kraftContribution"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
