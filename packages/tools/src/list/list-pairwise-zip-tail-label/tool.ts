import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ leftLength: number; rightLength: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftLength", label: "Left length", kind: "integer" },
  { id: "rightLength", label: "Right length", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.leftLength, 0, 1000000000);
  H.int(i.rightLength, 0, 1000000000);
  return H.finish({
    pairedCount: Math.min(i.leftLength, i.rightLength),
    unpairedLeft: Math.max(0, i.leftLength - i.rightLength),
    unpairedRight: Math.max(0, i.rightLength - i.leftLength),
    tailSide:
      i.leftLength === i.rightLength
        ? "none"
        : i.leftLength > i.rightLength
          ? "left"
          : "right",
  });
};
export const example = {
  input: { leftLength: 5, rightLength: 3 },
  output: {
    result: {
      pairedCount: 3,
      unpairedLeft: 2,
      unpairedRight: 0,
      tailSide: "left",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-pairwise-zip-tail-label",
  title: "List: List Pairwise Zip Tail Label Tool",
  description:
    "Plan a truncating pairwise zip from two explicit lengths while retaining which side loses an unmatched tail; no list construction.",
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
          pairedCount: { type: "number" },
          tailSide: { type: "string" },
          unpairedLeft: { type: "number" },
          unpairedRight: { type: "number" },
        },
        required: ["pairedCount", "tailSide", "unpairedLeft", "unpairedRight"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
