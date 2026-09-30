import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ enumJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "enumJson", label: "Enum json", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const values = H.array(H.json(i.enumJson));
  H.check(values.length > 0);
  return H.finish({
    containsNull: values.includes(null),
    enumSize: values.length,
  });
};
export const example = {
  input: { enumJson: '["x",null]' },
  output: { result: { containsNull: true, enumSize: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-schema-nullable-enum-flag",
  title: "JSON: JSON Schema Nullable Enum Flag Tool",
  description:
    "Inspect explicit null membership of one nonempty JSON Schema enum value array, not overall schema nullability under other keywords.",
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
          containsNull: { type: "boolean" },
          enumSize: { type: "number" },
        },
        required: ["containsNull", "enumSize"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
