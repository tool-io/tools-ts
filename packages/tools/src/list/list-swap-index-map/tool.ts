import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  index: number;
  first: number;
  second: number;
  length: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "Index", kind: "integer" },
  { id: "first", label: "First", kind: "integer" },
  { id: "second", label: "Second", kind: "integer" },
  { id: "length", label: "Length", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 1, 1000000);
  [i.index, i.first, i.second].forEach((x) => H.int(x, 0, i.length - 1));
  return H.finish({
    mappedIndex:
      i.index === i.first ? i.second : i.index === i.second ? i.first : i.index,
  });
};
export const example = {
  input: { index: 1, first: 1, second: 3, length: 4 },
  output: { result: { mappedIndex: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-swap-index-map",
  title: "List: List Swap Index Map Tool",
  description:
    "Map one valid element index through a specified list-index swap without copying list values.",
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
