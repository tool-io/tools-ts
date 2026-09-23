import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ alt: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "alt", label: "Alt", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^<[A-Za-z0-9_:.-]+>(?![\s\S])/.test(i.alt) ||
      i.alt === "*" ||
      /^[ACGTNacgtn]+(?![\s\S])/.test(i.alt),
  );
  return H.finish({
    symbolic: i.alt.startsWith("<"),
    identifier: i.alt.startsWith("<") ? i.alt.slice(1, -1) : "",
    spanningDeletion: i.alt === "*",
  });
};
export const example = {
  input: { alt: "<DEL>" },
  output: {
    result: { symbolic: true, identifier: "DEL", spanningDeletion: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bioinformatics/vcf-symbolic-alt-label",
  title: "Bioinformatics: VCF Symbolic Alt Label Tool",
  description:
    "Classify a restricted VCF ALT as a symbolic angle identifier, spanning-deletion star or nucleotide literal; excludes breakend grammar and biological interpretation.",
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
          identifier: { type: "string" },
          spanningDeletion: { type: "boolean" },
          symbolic: { type: "boolean" },
        },
        required: ["identifier", "spanningDeletion", "symbolic"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
