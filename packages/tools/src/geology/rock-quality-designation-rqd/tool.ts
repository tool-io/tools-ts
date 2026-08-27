import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RockQualityDesignationRqdInput = {
  readonly coreRunLengthCm: number;
  readonly pieceLengthsCm: readonly number[];
};

export type RockQualityDesignationRqdOutput = {
  readonly intactLengthCm: number;
  readonly rqdPercent: number;
};

export const calculateRockQualityDesignationRqd = (
  input: RockQualityDesignationRqdInput,
): RockQualityDesignationRqdOutput => {
  const { coreRunLengthCm, pieceLengthsCm } = input;
  if (!(coreRunLengthCm > 0))
    simpleError(
      "coreRunLengthCm",
      "Core run length must be greater than zero.",
      "invalid_run_length",
    );
  let intactLengthCm = 0;
  for (const piece of pieceLengthsCm) {
    if (!(piece >= 0))
      simpleError(
        "pieceLengthsCm",
        "Piece lengths must be non-negative.",
        "invalid_piece_length",
      );
    if (piece >= 10) intactLengthCm += piece;
  }
  return {
    intactLengthCm,
    rqdPercent: (intactLengthCm / coreRunLengthCm) * 100,
  };
};

export const rockQualityDesignationRqdExample = {
  input: {
    coreRunLengthCm: 150,
    pieceLengthsCm: [12, 8, 25, 9.5, 40, 10],
  },
  output: { intactLengthCm: 87, rqdPercent: 57.99999999999999 },
} satisfies ToolExample<
  RockQualityDesignationRqdInput,
  RockQualityDesignationRqdOutput
>;

export const rockQualityDesignationRqdTool = createSimpleTool({
  id: "geology/rock-quality-designation-rqd",
  title: "Rock Quality Designation RQD Calculator",
  description:
    "Rock Quality Designation RQD = 100 * (sum of intact core pieces at least 10 cm long) / total drilled core run length.",
  inputs: [
    {
      description: "Total core run length in centimetres.",
      id: "coreRunLengthCm",
      kind: "number",
      label: "Run length",
      unit: "cm",
    },
    {
      description:
        "Recovered piece lengths in centimetres; pieces of 10 cm or more count as sound.",
      id: "pieceLengthsCm",
      kind: "numberList",
      label: "Pieces",
    },
  ],
  outputs: [
    {
      description: "Sum of sound piece lengths in centimetres.",
      id: "intactLengthCm",
      kind: "number",
      label: "Intact length",
      unit: "cm",
    },
    {
      description: "Rock Quality Designation as a percentage.",
      id: "rqdPercent",
      kind: "number",
      label: "RQD",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateRockQualityDesignationRqd(
      input as unknown as RockQualityDesignationRqdInput,
    ),
});

export const runRockQualityDesignationRqd =
  rockQualityDesignationRqdTool.execute;
export default rockQualityDesignationRqdTool;
