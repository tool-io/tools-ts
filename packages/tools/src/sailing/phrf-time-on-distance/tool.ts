import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhrfTimeOnDistanceInput = {
  readonly distanceNm: number;
  readonly elapsedSeconds: number;
  readonly ratingSecondsPerNauticalMile: number;
};

export type PhrfTimeOnDistanceOutput = {
  readonly correctedTimeSeconds: number;
};

export const phrfTimeOnDistanceExample = {
  input: {
    distanceNm: 10,
    elapsedSeconds: 5000,
    ratingSecondsPerNauticalMile: 180,
  },
  output: { correctedTimeSeconds: 3200 },
} satisfies ToolExample<PhrfTimeOnDistanceInput, PhrfTimeOnDistanceOutput>;

export const calculatePhrfTimeOnDistance = (
  input: PhrfTimeOnDistanceInput,
): PhrfTimeOnDistanceOutput => {
  if (input.elapsedSeconds <= 0 || input.distanceNm <= 0)
    simpleError(
      "elapsedSeconds",
      "Elapsed time and course distance must be positive.",
      "invalid_input",
    );
  const correctedTimeSeconds =
    input.elapsedSeconds -
    input.ratingSecondsPerNauticalMile * input.distanceNm;
  if (!(correctedTimeSeconds > 0))
    simpleError(
      "ratingSecondsPerNauticalMile",
      "The rating allowance must leave a positive corrected time.",
      "invalid_rating",
    );
  return { correctedTimeSeconds };
};

export const phrfTimeOnDistanceTool = createSimpleTool({
  calculate: (input) =>
    calculatePhrfTimeOnDistance(input as unknown as PhrfTimeOnDistanceInput),
  description:
    "Compute a PHRF time-on-distance corrected time by subtracting the rating allowance over the course length from elapsed time.",
  id: "sailing/phrf-time-on-distance",
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
        "PHRF rating in seconds per nautical mile; fast boats may have negative ratings.",
      id: "ratingSecondsPerNauticalMile",
      kind: "number",
      label: "PHRF rating",
      unit: "s/NM",
    },
    {
      description: "Course length sailed.",
      id: "distanceNm",
      kind: "number",
      label: "Course distance",
      unit: "NM",
    },
  ],
  outputs: [
    {
      description: "Corrected time after subtracting the rating allowance.",
      format: "duration-s",
      id: "correctedTimeSeconds",
      kind: "number",
      label: "Corrected time",
      unit: "s",
    },
  ],
  title: "PHRF Time on Distance Calculator",
});
export const runPhrfTimeOnDistance = phrfTimeOnDistanceTool.execute;
export default phrfTimeOnDistanceTool;
