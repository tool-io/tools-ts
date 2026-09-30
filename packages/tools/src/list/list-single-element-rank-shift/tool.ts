import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  index: number;
  movedFrom: number;
  movedTo: number;
  length: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "Index", kind: "integer" },
  { id: "movedFrom", label: "Moved from", kind: "integer" },
  { id: "movedTo", label: "Moved to", kind: "integer" },
  { id: "length", label: "Length", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 1, 1000000000);
  [i.index, i.movedFrom, i.movedTo].forEach((x) => H.int(x, 0, i.length - 1));
  return H.finish({
    mappedIndex:
      i.index === i.movedFrom
        ? i.movedTo
        : i.movedFrom < i.movedTo &&
            i.index > i.movedFrom &&
            i.index <= i.movedTo
          ? i.index - 1
          : i.movedFrom > i.movedTo &&
              i.index >= i.movedTo &&
              i.index < i.movedFrom
            ? i.index + 1
            : i.index,
  });
};
export const example = {
  input: { index: 3, movedFrom: 1, movedTo: 4, length: 5 },
  output: { result: { mappedIndex: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-single-element-rank-shift",
  title: "List: List Single Element Rank Shift Tool",
  description:
    "Map one element index through a single remove-and-reinsert move to a final destination index, preserving all other element order.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { mappedIndex: { type: "number" } },
        required: ["mappedIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
