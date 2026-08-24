import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const POINTS_PER_PICA = 12;

export type PointsToPicaInput = {
  readonly points: number;
};

export type PointsToPicaOutput = {
  readonly picas: number;
};

export const pointsToPicaExample = {
  input: { points: 30 },
  output: { picas: 2.5 },
} satisfies ToolExample<PointsToPicaInput, PointsToPicaOutput>;

export const pointsToPicaTool = createSimpleTool({
  id: "typography/points-to-pica",
  title: "Points to Pica Converter",
  description:
    "Convert a typographic length in points to decimal picas using 12 points per pica.",
  inputs: [
    {
      description:
        "Points to convert; fractional and negative lengths are supported.",
      id: "points",
      kind: "number",
      label: "Points",
    },
  ],
  outputs: [
    {
      description: "Equivalent length in decimal picas.",
      id: "picas",
      kind: "number",
      label: "Picas",
    },
  ],
  calculate: (input) => {
    const points = input.points as number;
    return { picas: points / POINTS_PER_PICA };
  },
});

export const runPointsToPica = pointsToPicaTool.execute;
export default pointsToPicaTool;
