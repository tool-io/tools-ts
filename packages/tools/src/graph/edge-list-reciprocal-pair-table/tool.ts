import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ edgesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  const pairs: number[][] = [];
  for (let j = 0; j < e.length; j++)
    for (let k = j + 1; k < e.length; k++)
      if (
        e[j].source !== e[j].target &&
        e[j].source === e[k].target &&
        e[j].target === e[k].source
      )
        pairs.push([j, k]);
  return H.finish({ pairs });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
  },
  output: { result: { pairs: [[0, 1]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-reciprocal-pair-table",
  title: "Edge List Reciprocal Pair Table",
  description:
    "Return reciprocal directed nonloop edge occurrence pairs, retaining parallel occurrences and excluding self-loop self-reciprocity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pairs: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["pairs"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
