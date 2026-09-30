import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  requiredMembers: readonly string[];
  memberName: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "requiredMembers", label: "Required members", kind: "stringList" },
  { id: "memberName", label: "Member name", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(new Set(i.requiredMembers).size === i.requiredMembers.length);
  return H.finish({ required: i.requiredMembers.includes(i.memberName) });
};
export const example = {
  input: { requiredMembers: ["a", "b"], memberName: "a" },
  output: { result: { required: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-schema-required-member-flag",
  title: "JSON: JSON Schema Required Member Flag Tool",
  description:
    "Check one member against an explicitly supplied JSON Schema required-name array, rejecting duplicate declarations and not evaluating an entire schema.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { required: { type: "boolean" } },
        required: ["required"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
