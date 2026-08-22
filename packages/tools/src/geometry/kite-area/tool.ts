import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const kiteAreaTool = createSimpleTool({
  id: "geometry/kite-area",
  title: "Kite Area Calculator",
  description:
    "Calculate the area of a kite from the lengths of its two perpendicular diagonals.",
  inputs: [
    {
      description: "Length of the first diagonal.",
      id: "diagonalP",
      label: "Diagonal p",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Length of the second diagonal.",
      id: "diagonalQ",
      label: "Diagonal q",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "area", label: "Area", kind: "number" }],
  calculate: (input) => {
    return {
      area: ((input.diagonalP as number) * (input.diagonalQ as number)) / 2,
    };
  },
});
export const runKiteArea = kiteAreaTool.execute;
export default kiteAreaTool;

export type KiteAreaInput = {
  readonly diagonalP: number;
  readonly diagonalQ: number;
};

export type KiteAreaOutput = {
  readonly area: number;
};

export const kiteAreaExample = {
  input: {
    diagonalP: 1,
    diagonalQ: 1,
  },
  output: {
    area: 0.5,
  },
} satisfies ToolExample<KiteAreaInput, KiteAreaOutput>;
