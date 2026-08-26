import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SandpaperGritSequenceInput = {
  readonly startGrit: number;
};

export type SandpaperGritSequenceOutput = {
  readonly nextGrits: number[];
};

const fepaGritSequence = [
  60, 80, 100, 120, 150, 180, 220, 280, 320, 400, 500, 600, 800, 1000, 1200,
];

export const sandpaperGritSequenceExample = {
  input: { startGrit: 120 },
  output: { nextGrits: [150, 180, 220] },
} satisfies ToolExample<
  SandpaperGritSequenceInput,
  SandpaperGritSequenceOutput
>;

export const sandpaperGritSequenceTool = createSimpleTool({
  id: "carpentry/schleifpapier-grit-folge-lookup",
  title: "Sandpaper Grit Sequence Lookup",
  description:
    "Look up the next three FEPA sandpaper grits following a given starting grit.",
  inputs: [
    {
      description: "Starting FEPA grit number.",
      id: "startGrit",
      kind: "integer",
      label: "Start grit",
    },
  ],
  outputs: [
    {
      id: "nextGrits",
      kind: "numberList",
      label: "Next grits",
    },
  ],
  calculate: (input) => {
    const startGrit = input.startGrit as number;
    const index = fepaGritSequence.indexOf(startGrit);
    if (index === -1)
      simpleError(
        "startGrit",
        "Start grit is not part of the FEPA grit sequence.",
        "unknown_grit",
      );
    return { nextGrits: fepaGritSequence.slice(index + 1, index + 4) };
  },
});
export const runSandpaperGritSequence = sandpaperGritSequenceTool.execute;
export default sandpaperGritSequenceTool;
