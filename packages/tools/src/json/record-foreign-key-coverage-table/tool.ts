import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  parseJson,
  records,
  scalarKey,
} from "../batch53-shared.js";

export type Input = Readonly<{
  recordsJson: string;
  keyField: string;
  referenceKeysJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "Records json", kind: "string" },
  { id: "keyField", label: "Key field", kind: "string" },
  { id: "referenceKeysJson", label: "Reference keys json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const q = parseJson(i.referenceKeysJson);
  if (!Array.isArray(q)) simpleError("keys", "Scalar reference key array.");
  const keys = new Set(q.map(scalarKey));
  return {
    coverage: records(i.recordsJson).map((r, j) => ({
      recordIndex: j,
      keyPresent: Object.hasOwn(r, i.keyField),
      covered:
        Object.hasOwn(r, i.keyField) && keys.has(scalarKey(r[i.keyField])),
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    recordsJson: '[{"id":1},{"id":2},{}]',
    keyField: "id",
    referenceKeysJson: "[1]",
  },
  output: {
    result: {
      coverage: [
        { recordIndex: 0, keyPresent: true, covered: true },
        { recordIndex: 1, keyPresent: true, covered: false },
        { recordIndex: 2, keyPresent: false, covered: false },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/record-foreign-key-coverage-table",
  title: "Record Foreign Key Coverage Table",
  description:
    "Audit typed-scalar foreign-key coverage against an explicit reference inventory; absent and unmatched values remain distinct.",
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
