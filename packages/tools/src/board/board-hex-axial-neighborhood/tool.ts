import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ q: number; r: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "q", kind: "integer", label: "q" },
  { id: "r", kind: "integer", label: "r" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.q, -1e9, 1e9);
  H.int(i.r, -1e9, 1e9);
  return H.finish({
    neighbors: [
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
    ].map(([a, b]) => [i.q + a, i.r + b]),
  });
};
export const example = {
  input: { q: 0, r: 0 },
  output: {
    result: {
      neighbors: [
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, 0],
        [-1, 1],
        [0, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-hex-axial-neighborhood",
  title: "Board Hex Axial Neighborhood",
  description:
    "Enumerate six infinite axial hex-grid neighbors in a fixed direction order; no board clipping or geographic coordinates.",
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
          neighbors: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["neighbors"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
