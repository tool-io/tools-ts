import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ isrc: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "isrc", label: "Isrc", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[A-Z]{2}[A-Z0-9]{3}\d{7}(?![\s\S])/.test(i.isrc));
  return H.finish({ yearDigits: i.isrc.slice(5, 7), centuryResolved: false });
};
export const example = {
  input: { isrc: "USRC17607839" },
  output: { result: { yearDigits: "76", centuryResolved: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "validate/isrc-year-field-extractor",
  title: "Validation: Isrc Year Field Extractor Tool",
  description:
    "Extract the two-digit ISRC year-of-reference field from a strict twelve-character uppercase identifier; does not infer a century or recording year.",
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
          centuryResolved: { type: "boolean" },
          yearDigits: { type: "string" },
        },
        required: ["centuryResolved", "yearDigits"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
