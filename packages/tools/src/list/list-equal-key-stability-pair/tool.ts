import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstKey: number;
  secondKey: number;
  firstOriginalIndex: number;
  secondOriginalIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstKey", label: "First key", kind: "number" },
  { id: "secondKey", label: "Second key", kind: "number" },
  { id: "firstOriginalIndex", label: "First original index", kind: "integer" },
  {
    id: "secondOriginalIndex",
    label: "Second original index",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.firstOriginalIndex, 0, 1000000000);
  H.int(i.secondOriginalIndex, 0, 1000000000);
  H.check(i.firstOriginalIndex !== i.secondOriginalIndex);
  return H.finish({
    equalKeys: i.firstKey === i.secondKey,
    stableIfInThisOrder:
      i.firstKey !== i.secondKey ||
      i.firstOriginalIndex < i.secondOriginalIndex,
  });
};
export const example = {
  input: {
    firstKey: 2,
    secondKey: 2,
    firstOriginalIndex: 5,
    secondOriginalIndex: 3,
  },
  output: { result: { equalKeys: true, stableIfInThisOrder: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-equal-key-stability-pair",
  title: "List: List Equal Key Stability Pair Tool",
  description:
    "Check whether an explicit output-ordered pair preserves original order for equal numeric keys, without sorting or claiming whole-list stability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equalKeys: { type: "boolean" },
          stableIfInThisOrder: { type: "boolean" },
        },
        required: ["equalKeys", "stableIfInThisOrder"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
