import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  records,
  scalarKey,
} from "../batch53-shared.js";

export type Input = Readonly<{
  leftRecordsJson: string;
  rightRecordsJson: string;
  leftKey: string;
  rightKey: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftRecordsJson", label: "Left records json", kind: "string" },
  { id: "rightRecordsJson", label: "Right records json", kind: "string" },
  { id: "leftKey", label: "Left key", kind: "string" },
  { id: "rightKey", label: "Right key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = records(i.leftRecordsJson),
    b = records(i.rightRecordsJson),
    keys = new Set(
      b
        .filter((r) => Object.hasOwn(r, i.rightKey))
        .map((r) => scalarKey(r[i.rightKey])),
    ),
    indexes = a.flatMap((r, j) =>
      !Object.hasOwn(r, i.leftKey) || !keys.has(scalarKey(r[i.leftKey]))
        ? [j]
        : [],
    );
  return { records: indexes.map((j) => a[j]), sourceIndexes: indexes };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    leftRecordsJson: '[{"id":1},{"id":2},{}]',
    rightRecordsJson: '[{"id":1}]',
    leftKey: "id",
    rightKey: "id",
  },
  output: { result: { records: [{ id: 2 }, {}], sourceIndexes: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/record-left-anti-join",
  title: "Record Left Anti Join Tool",
  description:
    "Return left records without an exact typed-scalar right-key match, retaining absent left-key records and source indexes.",
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
