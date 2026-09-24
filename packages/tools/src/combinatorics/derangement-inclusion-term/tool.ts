import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ size: number; excludedCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "size", label: "Size", kind: "integer" },
  { id: "excludedCount", label: "Excluded count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.size, 0, 128);
  H.int(i.excludedCount, 0, i.size);
  return H.finish({
    signedInclusionTerm: String(
      ((i.excludedCount % 2 ? -1n : 1n) * H.factorial(i.size)) /
        H.factorial(i.excludedCount),
    ),
  });
};
export const example = {
  input: { size: 5, excludedCount: 2 },
  output: { result: { signedInclusionTerm: "60" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/derangement-inclusion-term",
  title: "Combinatorics: Derangement Inclusion Term Tool",
  description:
    "Return one exact signed n!/k! contribution to the derangement inclusion-exclusion sum, not the entire subfactorial.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedInclusionTerm: { type: "string" } },
        required: ["signedInclusionTerm"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
