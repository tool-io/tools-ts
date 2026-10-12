import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  occupied: readonly string[];
  from: string;
  to: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "occupied", kind: "stringList", label: "occupied" },
  { id: "from", kind: "string", label: "from" },
  { id: "to", kind: "string", label: "to" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(H.unique(i.occupied).length === i.occupied.length);
  return H.finish({
    sourcePresent: i.occupied.includes(i.from),
    destinationOccupied: i.occupied.includes(i.to),
    sameCell: i.from === i.to,
  });
};
export const example = {
  input: { occupied: ["a1", "b1"], from: "a1", to: "b1" },
  output: {
    result: { sourcePresent: true, destinationOccupied: true, sameCell: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-move-source-destination-audit",
  title: "Board Move Source Destination Audit",
  description:
    "Audit explicit board occupancy at move source/destination, without deciding piece movement, capture rules or legal moves.",
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
          sourcePresent: { type: "boolean" },
          destinationOccupied: { type: "boolean" },
          sameCell: { type: "boolean" },
        },
        required: ["sourcePresent", "destinationOccupied", "sameCell"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
