import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StartLineLengthRequiredInput = {
  readonly boatCount: number;
  readonly averageBoatLengthMeters: number;
  readonly scaleFactor?: number;
};

export type StartLineLengthRequiredOutput = {
  readonly recommendedLineLengthMeters: number;
};

const DEFAULT_SCALE_FACTOR = 3;

export const startLineLengthRequiredExample = {
  input: { boatCount: 10, averageBoatLengthMeters: 12 },
  output: { recommendedLineLengthMeters: 360 },
} satisfies ToolExample<
  StartLineLengthRequiredInput,
  StartLineLengthRequiredOutput
>;

export const calculateStartLineLengthRequired = (
  input: StartLineLengthRequiredInput,
): StartLineLengthRequiredOutput => {
  if (!(input.averageBoatLengthMeters > 0))
    simpleError(
      "averageBoatLengthMeters",
      "Average boat length must be positive.",
      "invalid_length",
    );
  return {
    recommendedLineLengthMeters:
      input.boatCount *
      input.averageBoatLengthMeters *
      (input.scaleFactor ?? DEFAULT_SCALE_FACTOR),
  };
};

export const startLineLengthRequiredTool = createSimpleTool({
  id: "sailing/start-line-length-required",
  title: "Start Line Length Rule",
  description:
    "Recommend a starting line length from the fleet size and average boat length using an adjustable scale factor.",
  inputs: [
    {
      description: "Number of boats competing in the start.",
      id: "boatCount",
      kind: "integer",
      label: "Boat count",
      minimum: 2,
    },
    {
      description: "Average overall length of the competing boats.",
      id: "averageBoatLengthMeters",
      kind: "number",
      label: "Average boat length",
      unit: "m",
    },
    {
      default: DEFAULT_SCALE_FACTOR,
      description: "Line lengths provided per average boat length.",
      id: "scaleFactor",
      kind: "number",
      label: "Scale factor",
      maximum: 6,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Recommended overall start line length.",
      format: "length-m",
      id: "recommendedLineLengthMeters",
      kind: "number",
      label: "Recommended line length",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateStartLineLengthRequired(
      input as unknown as StartLineLengthRequiredInput,
    ),
});

export const runStartLineLengthRequired = startLineLengthRequiredTool.execute;
export default startLineLengthRequiredTool;
