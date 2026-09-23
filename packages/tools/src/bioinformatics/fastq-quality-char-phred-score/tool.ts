import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ character: string; offset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "character", label: "Character", kind: "string" },
  { id: "offset", label: "Offset", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.offset === 33 || i.offset === 64);
  H.check(
    i.character.length === 1 &&
      i.character.charCodeAt(0) >= i.offset &&
      i.character.charCodeAt(0) <= 126,
  );
  return H.finish({ phredScore: i.character.charCodeAt(0) - i.offset });
};
export const example = {
  input: { character: "I", offset: 33 },
  output: { result: { phredScore: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bioinformatics/fastq-quality-char-phred-score",
  title: "Bioinformatics: Fastq Quality Char Phred Score Tool",
  description:
    "Decode one printable FASTQ quality character under explicitly selected historical ASCII offset33 or64, without auto-detecting encoding or validating a read.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { phredScore: { type: "number" } },
        required: ["phredScore"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
