import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ prefix: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "prefix", label: "Prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    prefixShape: /^10\.\d{4,9}(?![\s\S])/.test(i.prefix),
    registrationVerified: false,
  });
};
export const example = {
  input: { prefix: "10.1000" },
  output: { result: { prefixShape: true, registrationVerified: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "validate/doi-prefix-single-field-check",
  title: "Validation: DOI Prefix Single Field Check Tool",
  description:
    "Check the commonly specified DOI registrant-prefix lexical shape only, without validating a suffix, registration or resolution.",
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
          prefixShape: { type: "boolean" },
          registrationVerified: { type: "boolean" },
        },
        required: ["prefixShape", "registrationVerified"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
