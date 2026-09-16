import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  parseJson,
  record,
  records,
  scalarKey,
} from "../batch53-shared.js";

export type Input = Readonly<{
  recordsJson: string;
  keyField: string;
  queryJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "Records json", kind: "string" },
  { id: "keyField", label: "Key field", kind: "string" },
  { id: "queryJson", label: "Query json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const q = scalarKey(parseJson(i.queryJson)),
    a = records(i.recordsJson),
    j = a.findIndex(
      (r) => Object.hasOwn(r, i.keyField) && scalarKey(r[i.keyField]) === q,
    );
  return {
    found: j >= 0,
    recordIndex: j >= 0 ? j : null,
    record: j >= 0 ? a[j] : null,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { recordsJson: '[{"id":1},{"id":1}]', keyField: "id", queryJson: "1" },
  output: { result: { found: true, recordIndex: 0, record: { id: 1 } } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/record-first-match-lookup",
  title: "Record First Match Lookup",
  description:
    "Find the first exact typed-scalar own-key match; return explicit null when no record matches.",
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
