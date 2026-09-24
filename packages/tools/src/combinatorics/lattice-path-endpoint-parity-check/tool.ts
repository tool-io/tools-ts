import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  steps: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "startX", label: "Start x", kind: "integer" },
  { id: "startY", label: "Start y", kind: "integer" },
  { id: "endX", label: "End x", kind: "integer" },
  { id: "endY", label: "End y", kind: "integer" },
  { id: "steps", label: "Steps", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.startX, i.startY, i.endX, i.endY].forEach((x) =>
    H.int(x, -1000000, 1000000),
  );
  H.int(i.steps, 0, 1000000);
  const distance = Math.abs(i.endX - i.startX) + Math.abs(i.endY - i.startY);
  return H.finish({
    parityCompatible: distance % 2 === i.steps % 2,
    reachable: distance <= i.steps && distance % 2 === i.steps % 2,
    manhattanDistance: distance,
  });
};
export const example = {
  input: { startX: 0, startY: 0, endX: 2, endY: 1, steps: 4 },
  output: {
    result: { parityCompatible: false, reachable: false, manhattanDistance: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/lattice-path-endpoint-parity-check",
  title: "Combinatorics: Lattice Path Endpoint Parity Check Tool",
  description:
    "Check necessary and sufficient reachability for unrestricted four-neighbor square-lattice walks of a supplied length, not obstacle-aware pathfinding.",
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
          manhattanDistance: { type: "number" },
          parityCompatible: { type: "boolean" },
          reachable: { type: "boolean" },
        },
        required: ["manhattanDistance", "parityCompatible", "reachable"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
