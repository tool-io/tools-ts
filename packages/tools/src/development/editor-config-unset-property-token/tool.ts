import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ property: string; value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "property", label: "Property", kind: "string" },
  { id: "value", label: "Value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^[A-Za-z0-9_]+(?![\s\S])/.test(i.property) &&
      i.value.length > 0 &&
      !/[\r\n]/.test(i.value),
  );
  return H.finish({
    property: i.property.toLowerCase(),
    unset: i.value.toLowerCase() === "unset",
  });
};
export const example = {
  input: { property: "Indent_Size", value: "UNSET" },
  output: { result: { property: "indent_size", unset: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/editor-config-unset-property-token",
  title: "Development: Editor Config Unset Property Token Tool",
  description:
    "Recognize the EditorConfig unset value for one explicit property without reading files, inheritance or editor defaults.",
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
          property: { type: "string" },
          unset: { type: "boolean" },
        },
        required: ["property", "unset"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
