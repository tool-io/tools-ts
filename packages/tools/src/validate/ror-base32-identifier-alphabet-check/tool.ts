import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ identifier: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "identifier", label: "Identifier", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    lexicallyValid: /^0[0-9a-hjkmnp-tv-z]{6}\d{2}(?![\s\S])/.test(i.identifier),
    checksumChecked: false,
  });
};
export const example = {
  input: { identifier: "03yrm5c26" },
  output: { result: { lexicallyValid: true, checksumChecked: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "validate/ror-base32-identifier-alphabet-check",
  title: "Validation: Ror Base32 Identifier Alphabet Check Tool",
  description:
    "Check the nine-character ROR local-id lexical form: leading zero, six restricted base32 characters and two decimal checksum digits; checksum and registry are not evaluated.",
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
          checksumChecked: { type: "boolean" },
          lexicallyValid: { type: "boolean" },
        },
        required: ["checksumChecked", "lexicallyValid"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
