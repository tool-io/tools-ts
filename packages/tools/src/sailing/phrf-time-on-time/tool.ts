import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhrfTimeOnTimeInput = {
  readonly elapsedSeconds: number;
  readonly ratingSecondsPerHour: number;
};

export type PhrfTimeOnTimeOutput = {
  readonly correctedTimeSeconds: number;
  readonly timeOnTimeCoefficient: number;
};

const TIME_ON_TIME_NUMERATOR = 650;
const TIME_ON_TIME_RATING_OFFSET = 520;

export const phrfTimeOnTimeExample = {
  input: { elapsedSeconds: 5400, ratingSecondsPerHour: 156 },
  output: {
    correctedTimeSeconds: 5192.307692307692,
    timeOnTimeCoefficient: 0.9615384615384616,
  },
} satisfies ToolExample<PhrfTimeOnTimeInput, PhrfTimeOnTimeOutput>;

export const calculatePhrfTimeOnTime = (
  input: PhrfTimeOnTimeInput,
): PhrfTimeOnTimeOutput => {
  if (input.elapsedSeconds <= 0)
    simpleError(
      "elapsedSeconds",
      "Elapsed time must be positive.",
      "invalid_input",
    );
  if (!(
    Number.isFinite(input.ratingSecondsPerHour) &&
    input.ratingSecondsPerHour > -520
  ))
    simpleError(
      "ratingSecondsPerHour",
      "The rating must be finite and greater than -520 seconds per hour.",
      "invalid_rating",
    );
  const coefficient =
    TIME_ON_TIME_NUMERATOR /
    (TIME_ON_TIME_RATING_OFFSET + input.ratingSecondsPerHour);
  return {
    correctedTimeSeconds: input.elapsedSeconds * coefficient,
    timeOnTimeCoefficient: coefficient,
  };
};

export const phrfTimeOnTimeTool = createSimpleTool({
  calculate: (input) =>
    calculatePhrfTimeOnTime(input as unknown as PhrfTimeOnTimeInput),
  description:
    "Compute a PHRF time-on-time corrected time by scaling elapsed time with the coefficient six hundred fifty over five hundred twenty plus rating.",
  id: "sailing/phrf-time-on-time",
  inputs: [
    {
      description: "Elapsed time from start to finish.",
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed time",
      unit: "s",
    },
    {
      description:
        "PHRF rating in seconds per hour; must exceed minus five hundred twenty.",
      id: "ratingSecondsPerHour",
      kind: "number",
      label: "PHRF rating",
      minimum: -519,
      unit: "s/h",
    },
  ],
  outputs: [
    {
      description: "Corrected time after applying the coefficient.",
      format: "duration-s",
      id: "correctedTimeSeconds",
      kind: "number",
      label: "Corrected time",
      unit: "s",
    },
    {
      description:
        "Multiplier six hundred fifty divided by five hundred twenty plus rating.",
      format: "ratio",
      id: "timeOnTimeCoefficient",
      kind: "number",
      label: "Time-on-time coefficient",
    },
  ],
  title: "PHRF Time on Time Calculator",
});
export const runPhrfTimeOnTime = phrfTimeOnTimeTool.execute;
export default phrfTimeOnTimeTool;
