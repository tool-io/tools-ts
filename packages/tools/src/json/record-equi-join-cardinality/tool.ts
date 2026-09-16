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
    b = records(i.rightRecordsJson);
  let pairs = 0;
  const counts = a.map((r) => {
    if (!Object.hasOwn(r, i.leftKey)) return 0;
    const k = scalarKey(r[i.leftKey]),
      n = b.filter(
        (s) => Object.hasOwn(s, i.rightKey) && scalarKey(s[i.rightKey]) === k,
      ).length;
    pairs += n;
    return n;
  });
  return { matchingPairCount: pairs, rightMatchCountsPerLeft: counts };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    leftRecordsJson: '[{"id":1},{"id":1}]',
    rightRecordsJson: '[{"key":1},{"key":1}]',
    leftKey: "id",
    rightKey: "key",
  },
  output: { result: { matchingPairCount: 4, rightMatchCountsPerLeft: [2, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/record-equi-join-cardinality",
  title: "Record Equijoin Cardinality Counter",
  description:
    "Count exact typed-scalar equijoin pairs with full duplicate multiplicity; absent members do not join, explicit null values can join.",
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
