import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, records } from "../batch53-shared.js";

export type Input = Readonly<{
  recordsJson: string;
  candidateFields: readonly string[];
  targetField: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "Records json", kind: "string" },
  { id: "candidateFields", label: "Candidate fields", kind: "stringList" },
  { id: "targetField", label: "Target field", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    records: records(i.recordsJson).map((r) => {
      const k = i.candidateFields.find(
        (k) => Object.hasOwn(r, k) && r[k] !== null,
      );
      return Object.fromEntries([
        ...Object.entries(r).filter(([k]) => k !== i.targetField),
        [i.targetField, k === undefined ? null : r[k]],
      ]);
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    recordsJson: '[{"a":null,"b":0},{}]',
    candidateFields: ["a", "b"],
    targetField: "x",
  },
  output: { result: { records: [{ a: null, b: 0, x: 0 }, { x: null }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/record-field-coalesce",
  title: "Record Field Coalesce Tool",
  description:
    "Coalesce first present nonnull field into a supplied target; zero, false and empty strings are valid values, all missing yields null.",
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
