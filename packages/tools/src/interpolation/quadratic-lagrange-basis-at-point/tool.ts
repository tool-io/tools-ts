import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  nodes: readonly number[];
  basisIndex: number;
  x: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "nodes", label: "Nodes", kind: "numberList" },
  { id: "basisIndex", label: "Basis index", kind: "integer" },
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.nodes.length === 3 && new Set(i.nodes).size === 3);
  H.int(i.basisIndex, 0, 2);
  const value = i.nodes.reduce(
    (p, node, j) =>
      j === i.basisIndex
        ? p
        : (p * (i.x - node)) / (i.nodes[i.basisIndex] - node),
    1,
  );
  return H.finish({ basisValue: value });
};
export const example = {
  input: { nodes: [0, 1, 2], basisIndex: 1, x: 0.5 },
  output: { result: { basisValue: 0.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/quadratic-lagrange-basis-at-point",
  title: "Interpolation: Quadratic Lagrange Basis At Point Tool",
  description:
    "Evaluate one quadratic Lagrange cardinal basis polynomial at a supplied x on exactly three distinct nodes; permits extrapolation without fitting or a general engine.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { basisValue: { type: "number" } },
        required: ["basisValue"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
