import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
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
    m = new Map<string, { key: JsonScalar; indexes: number[] }>(),
    missing: number[] = [];
  a.forEach((r, j) => {
    if (!Object.hasOwn(r, i.keyField)) {
      missing.push(j);
      return;
    }
    const value = scalarValue(r[i.keyField]),
      k = scalarKey(value);
    if (!m.has(k)) m.set(k, { key: value, indexes: [] });
    m.get(k)!.indexes.push(j);
  });
  return {
    groups: [...m.values()].map((v) => ({ ...v, count: v.indexes.length })),
    missingRecordIndexes: missing,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { recordsJson: '[{"id":1},{"id":1},{}]', keyField: "id" },
  output: {
    result: {
      groups: [{ key: 1, indexes: [0, 1], count: 2 }],
      missingRecordIndexes: [2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/record-key-multiplicity-audit",
  title: "Record Key Multiplicity Audit",
  description:
    "Audit typed-scalar record key multiplicities while retaining missing-key records and duplicate positions.",
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
          groups: {
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
                indexes: {
                  type: "array",
                  items: { type: "integer", minimum: 0 },
                },
                count: { type: "integer", minimum: 0 },
              },
              required: ["key", "indexes", "count"],
            },
          },
          missingRecordIndexes: {
            type: "array",
            items: { type: "integer", minimum: 0 },
          },
        },
        required: ["groups", "missingRecordIndexes"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
