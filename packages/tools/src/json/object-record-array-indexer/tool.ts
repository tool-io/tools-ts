import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
  record,
  records,
  scalarKey,
  scalarValue,
} from "../batch53-shared.js";
import type { JsonScalar } from "../batch53-shared.js";

export type Input = Readonly<{ recordsJson: string; keyField: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "recordsJson", label: "Records json", kind: "string" },
  { id: "keyField", label: "Key field", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const a = records(i.recordsJson),
    out: { key: JsonScalar; recordIndex: number }[] = [];
  const seen = new Set<string>();
  a.forEach((r, j) => {
    if (!Object.hasOwn(r, i.keyField))
      simpleError("key", "Every record must have an own scalar index key.");
    const value = scalarValue(r[i.keyField]),
      k = scalarKey(value);
    if (seen.has(k))
      simpleError("key", "Index keys must be unique by type and value.");
    seen.add(k);
    out.push({ key: value, recordIndex: j });
  });
  return { index: out };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { recordsJson: '[{"id":1},{"id":"1"}]', keyField: "id" },
  output: {
    result: {
      index: [
        { key: 1, recordIndex: 0 },
        { key: "1", recordIndex: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/object-record-array-indexer",
  title: "Record Array Unique Key Indexer",
  description:
    "Build a unique typed-scalar record index as entries; numeric and string keys remain distinct, missing and duplicate keys fail.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          index: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: {
                  anyOf: [
                    { type: "null" },
                    { type: "boolean" },
                    { type: "number" },
                    { type: "string" },
                  ],
                },
                recordIndex: { type: "integer", minimum: 0 },
              },
              required: ["key", "recordIndex"],
            },
          },
        },
        required: ["index"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
