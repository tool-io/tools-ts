import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ codon: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "codon", label: "Codon", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[ACGTRYSWKMBDHVN]{3}(?![\s\S])/.test(i.codon));
  return H.finish({
    ambiguousPositions: Array.from(i.codon).flatMap((c, j) =>
      "ACGT".includes(c) ? [] : [j + 1],
    ),
    unambiguous: /^[ACGT]{3}(?![\s\S])/.test(i.codon),
  });
};
export const example = {
  input: { codon: "ARN" },
  output: { result: { ambiguousPositions: [2, 3], unambiguous: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bioinformatics/codon-ambiguity-position-mask",
  title: "Bioinformatics: Codon Ambiguity Position Mask Tool",
  description:
    "Inspect one uppercase DNA IUPAC codon for ambiguous nucleotide positions counted from one; no translation, strand inference or sequence generation.",
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
          ambiguousPositions: { type: "array", items: { type: "number" } },
          unambiguous: { type: "boolean" },
        },
        required: ["ambiguousPositions", "unambiguous"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
