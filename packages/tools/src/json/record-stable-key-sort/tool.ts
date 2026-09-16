import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  records,
  scalarKey,
} from "../batch53-shared.js";

export type Input = Readonly<{
  recordsJson: string;
  keyField: string;
  descending: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "Records json", kind: "string" },
  { id: "keyField", label: "Key field", kind: "string" },
  { id: "descending", label: "Descending", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = records(i.recordsJson);
  a.forEach((r) => {
    if (!Object.hasOwn(r, i.keyField))
      simpleError("key", "Own scalar sort field required.");
    scalarKey(r[i.keyField]);
  });
  const out = a
    .map((r, j) => ({ r, j }))
    .sort((x, y) => {
      const a = x.r[i.keyField],
        b = y.r[i.keyField];
      let d = 0;
      if (
        typeof a === typeof b &&
        typeof a === "number" &&
        typeof b === "number"
      )
        d = a < b ? -1 : a > b ? 1 : 0;
      else {
        const ka = scalarKey(a),
          kb = scalarKey(b);
        d = ka < kb ? -1 : ka > kb ? 1 : 0;
      }
      return (i.descending ? -d : d) || x.j - y.j;
    });
  return { records: out.map((v) => v.r), sourceIndexes: out.map((v) => v.j) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    recordsJson: '[{"id":2},{"id":1},{"id":2}]',
    keyField: "id",
    descending: false,
  },
  output: {
    result: {
      records: [{ id: 1 }, { id: 2 }, { id: 2 }],
      sourceIndexes: [1, 0, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/record-stable-key-sort",
  title: "Record Stable Key Sort",
  description:
    "Stably sort own scalar record keys: numeric keys numerically, other/mixed scalar keys by typed JSON spelling; ties retain source order.",
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
