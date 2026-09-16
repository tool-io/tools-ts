import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique, records } from "../batch53-shared.js";

export type Input = Readonly<{
  recordsJson: string;
  fields: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "Records json", kind: "string" },
  { id: "fields", label: "Fields", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  unique(i.fields, "fields");
  return {
    presence: records(i.recordsJson).map((r) =>
      i.fields.map((k) => Object.hasOwn(r, k)),
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { recordsJson: '[{"a":null},{}]', fields: ["a", "b"] },
  output: {
    result: {
      presence: [
        [true, false],
        [false, false],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/record-field-presence-matrix",
  title: "Record Field Presence Matrix",
  description:
    "Build a record/field own-presence matrix; an explicit null member counts as present.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
