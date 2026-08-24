import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const POINTS_PER_PICA = 12;

export type PicaToPointsInput = {
  readonly picas: number;
};

export type PicaToPointsOutput = {
  readonly points: number;
};

export const picaToPointsExample = {
  input: { picas: 2 },
  output: { points: 24 },
} satisfies ToolExample<PicaToPointsInput, PicaToPointsOutput>;

export const picaToPointsTool = createSimpleTool({
  id: "typography/pica-to-points",
  title: "Pica to Points Converter",
  description: "Convert a length in picas to points.",
  inputs: [
    {
      description: "Picas to convert.",
      id: "picas",
      kind: "number",
      label: "Picas",
    },
  ],
  outputs: [
    {
      description: "Equivalent length in points.",
      id: "points",
      kind: "number",
      label: "Points",
    },
  ],
  calculate: (input) => {
    const picas = input.picas as number;
    return { points: picas * POINTS_PER_PICA };
  },
});

export const runPicaToPoints = picaToPointsTool.execute;
export default picaToPointsTool;
