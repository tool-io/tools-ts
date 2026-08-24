import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GoldenNumberCyclePositionInput = {
  readonly year: number;
};

export type GoldenNumberCyclePositionOutput = {
  readonly goldenNumber: number;
  readonly metonicPhase: number;
  readonly yearsToCycleRestart: number;
};

export const calculateGoldenNumberCyclePosition = (
  input: GoldenNumberCyclePositionInput,
): GoldenNumberCyclePositionOutput => {
  if (!(Number.isSafeInteger(input.year) && input.year >= 1))
    return simpleError(
      "year",
      "Year must be a positive integer.",
      "invalid_year",
    );
  const metonicPhase = ((input.year % 19) + 19) % 19;
  return {
    goldenNumber: metonicPhase + 1,
    metonicPhase,
    yearsToCycleRestart: (19 - metonicPhase) % 19 || 19,
  };
};

export const goldenNumberCyclePositionExample = {
  input: { year: 2024 },
  output: { goldenNumber: 11, metonicPhase: 10, yearsToCycleRestart: 9 },
} satisfies ToolExample<
  GoldenNumberCyclePositionInput,
  GoldenNumberCyclePositionOutput
>;

export const goldenNumberCyclePositionTool = createSimpleTool({
  id: "paleography/golden-number-cycle-position",
  title: "Golden Number Cycle Position",
  description:
    "Place a calendar year in the 19-year Metonic computus cycle using the standard medieval key goldenNumber = (year mod 19) + 1.",
  inputs: [
    {
      description: "Calendar year (AD).",
      id: "year",
      kind: "integer",
      label: "Year",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Golden number of the year (1-19).",
      id: "goldenNumber",
      kind: "integer",
      label: "Golden number",
      maximum: 19,
      minimum: 1,
    },
    {
      description: "Zero-based position within the Metonic cycle (0-18).",
      id: "metonicPhase",
      kind: "integer",
      label: "Metonic phase",
      maximum: 18,
      minimum: 0,
    },
    {
      description: "Years until the phase resets to golden number 1.",
      id: "yearsToCycleRestart",
      kind: "integer",
      label: "Years to restart",
      maximum: 19,
      minimum: 1,
    },
  ],
  calculate: (input) =>
    calculateGoldenNumberCyclePosition({ year: input.year as number }),
});

export const runGoldenNumberCyclePosition =
  goldenNumberCyclePositionTool.execute;
export default goldenNumberCyclePositionTool;
