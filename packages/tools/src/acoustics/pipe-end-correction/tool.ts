import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PipeEndCorrectionInput = Readonly<{
  readonly pipeRadiusMeters: number;
}>;
export type PipeEndCorrectionOutput = Readonly<{
  readonly correctionMeters: number;
}>;

export const calculatePipeEndCorrection = (
  x: PipeEndCorrectionInput,
): PipeEndCorrectionOutput => {
  if (!Number.isFinite(x.pipeRadiusMeters) || x.pipeRadiusMeters <= 0)
    simpleError("pipeRadiusMeters", "Provide a finite positive number.");
  const correctionMeters = 0.61 * x.pipeRadiusMeters;
  if (!Number.isFinite(correctionMeters))
    simpleError(
      "correctionMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    correctionMeters: Object.is(correctionMeters, -0) ? 0 : correctionMeters,
  };
};

export const example = {
  input: {
    pipeRadiusMeters: 0.05,
  },
  output: { correctionMeters: 0.0305 },
} satisfies ToolExample<PipeEndCorrectionInput, PipeEndCorrectionOutput>;

export const tool = createSimpleTool({
  id: "acoustics/pipe-end-correction",
  title: "Pipe End Correction",
  description:
    "Approximate unflanged open-pipe end correction 0.61 times the pipe radius, per open end.",
  inputs: [
    {
      id: "pipeRadiusMeters",
      kind: "number",
      label: "Pipe Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "correctionMeters",
      kind: "number",
      label: "Correction Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculatePipeEndCorrection({
      pipeRadiusMeters: input.pipeRadiusMeters as number,
    }),
});
export const pipeEndCorrectionTool = tool;
export const runPipeEndCorrection = tool.execute;
export default tool;
