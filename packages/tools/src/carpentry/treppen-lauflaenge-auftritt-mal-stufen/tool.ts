import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type StairRunLengthInput = {
  readonly stepCount: number;
  readonly treadDepthCm: number;
};

export type StairRunLengthOutput = {
  readonly runLengthCm: number;
};

export const stairRunLengthExample = {
  input: { stepCount: 14, treadDepthCm: 29 },
  output: { runLengthCm: 377 },
} satisfies ToolExample<StairRunLengthInput, StairRunLengthOutput>;

export const stairRunLengthTool = createSimpleTool({
  id: "carpentry/treppen-lauflaenge-auftritt-mal-stufen",
  title: "Stair Run Length Calculator",
  description:
    "Compute the total stair run in centimeters as the tread depth times the number of steps minus one.",
  inputs: [
    {
      description: "Tread depth in centimeters.",
      id: "treadDepthCm",
      kind: "number",
      label: "Tread depth",
      maximum: 35,
      minimum: 20,
      unit: "cm",
    },
    {
      description:
        "Number of steps including the top landing step, at least two.",
      id: "stepCount",
      kind: "integer",
      label: "Step count",
      minimum: 2,
    },
  ],
  outputs: [
    {
      description:
        "Total horizontal run in centimeters, the tread depth times the step count minus one.",
      id: "runLengthCm",
      kind: "number",
      label: "Run length",
      unit: "cm",
    },
  ],
  calculate: (input) => ({
    runLengthCm:
      (input.treadDepthCm as number) * ((input.stepCount as number) - 1),
  }),
});
export const runStairRunLength = stairRunLengthTool.execute;
export default stairRunLengthTool;
