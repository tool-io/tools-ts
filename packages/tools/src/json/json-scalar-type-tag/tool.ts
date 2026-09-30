import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ valueJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "valueJson", label: "Value json", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const value = H.json(i.valueJson);
  H.check(value === null || typeof value !== "object");
  return H.finish({ type: value === null ? "null" : typeof value });
};
export const example = {
  input: { valueJson: "false" },
  output: { result: { type: "boolean" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-scalar-type-tag",
  title: "JSON: JSON Scalar Type Tag Tool",
  description:
    "Tag one parsed JSON scalar, explicitly distinguishing null and rejecting arrays/objects rather than pretending they are scalars.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { type: { type: "string" } },
        required: ["type"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
