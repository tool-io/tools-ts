import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dayNightLevelDecibels: number;
  readonly knownSegmentLevelDecibels: number;
  readonly solveFor: "day" | "night";
}>;
export type Output = Readonly<{
  readonly solvedSegmentLevelDecibels: number;
  readonly solvedSegment: "day" | "night";
}>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.dayNightLevelDecibels) ||
    !Number.isFinite(input.knownSegmentLevelDecibels)
  )
    simpleError(
      "dayNightLevelDecibels",
      "Levels must be finite.",
      "invalid_level",
    );
  const totalEnergy = 24 * 10 ** (input.dayNightLevelDecibels / 10);
  const directRemaining =
    input.solveFor === "night"
      ? (totalEnergy - 15 * 10 ** (input.knownSegmentLevelDecibels / 10)) / 9
      : (totalEnergy -
          9 * 10 ** ((input.knownSegmentLevelDecibels + 10) / 10)) /
        15;
  let solvedSegmentLevelDecibels: number;
  if (directRemaining > 0 && Number.isFinite(directRemaining)) {
    solvedSegmentLevelDecibels =
      10 * Math.log10(directRemaining) - (input.solveFor === "night" ? 10 : 0);
  } else {
    const totalAggregateDecibels =
      input.dayNightLevelDecibels + 10 * Math.log10(24);
    const knownAggregateDecibels =
      input.knownSegmentLevelDecibels +
      (input.solveFor === "night"
        ? 10 * Math.log10(15)
        : 10 + 10 * Math.log10(9));
    if (knownAggregateDecibels >= totalAggregateDecibels)
      simpleError(
        "knownSegmentLevelDecibels",
        "Known segment is inconsistent with the supplied DNL.",
        "inconsistent_levels",
      );
    const relativeNaturalLog =
      ((knownAggregateDecibels - totalAggregateDecibels) * Math.LN10) / 10;
    const remainingAggregateDecibels =
      totalAggregateDecibels +
      (10 / Math.LN10) * Math.log1p(-Math.exp(relativeNaturalLog));
    solvedSegmentLevelDecibels =
      remainingAggregateDecibels -
      (input.solveFor === "night"
        ? 10 + 10 * Math.log10(9)
        : 10 * Math.log10(15));
  }
  if (!Number.isFinite(solvedSegmentLevelDecibels))
    simpleError(
      "knownSegmentLevelDecibels",
      "Known segment is inconsistent with the supplied DNL.",
      "inconsistent_levels",
    );
  return { solvedSegmentLevelDecibels, solvedSegment: input.solveFor };
};

export const example = {
  input: {
    dayNightLevelDecibels: 60,
    knownSegmentLevelDecibels: 60,
    solveFor: "night",
  },
  output: { solvedSegmentLevelDecibels: 50, solvedSegment: "night" },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    dayNightLevelDecibels: 60,
    knownSegmentLevelDecibels: 50,
    solveFor: "day",
  },
  output: { solvedSegmentLevelDecibels: 60, solvedSegment: "day" },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      dayNightLevelDecibels: input.dayNightLevelDecibels as number,
      knownSegmentLevelDecibels: input.knownSegmentLevelDecibels as number,
      solveFor: input.solveFor as Input["solveFor"],
    }),
  description:
    "Solve the standard 15-hour day or 9-hour night Leq from DNL and the other segment, retaining the 10 dB night penalty.",
  id: "acoustics/dnl-segment-level-solver",
  inputs: [
    { id: "dayNightLevelDecibels", kind: "number", label: "DNL", unit: "dB" },
    {
      id: "knownSegmentLevelDecibels",
      kind: "number",
      label: "Known segment Leq",
      unit: "dB",
    },
    {
      id: "solveFor",
      kind: "string",
      label: "Segment to solve",
      enum: ["day", "night"],
    },
  ],
  outputs: [
    {
      id: "solvedSegmentLevelDecibels",
      kind: "number",
      label: "Solved segment Leq",
      unit: "dB",
    },
    {
      id: "solvedSegment",
      kind: "string",
      label: "Solved segment",
      enum: ["day", "night"],
    },
  ],
  title: "DNL Segment Level Solver",
});

export const run = tool.execute;
export default tool;
