import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly playCodes: readonly string[];
  readonly trackedCodes: readonly string[];
}>;
export type Output = Readonly<{
  readonly trackedPlayCount: number;
  readonly missingTrackedCodes: readonly string[];
  readonly countsByTrackedCode: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const normalized = input.playCodes.map((value) => value.trim().toLowerCase());
  const tracked = input.trackedCodes
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const countsByTrackedCode = tracked.map(
    (code) => normalized.filter((value) => value === code).length,
  );
  return {
    trackedPlayCount: countsByTrackedCode.reduce((a, b) => a + b, 0),
    missingTrackedCodes: tracked.filter(
      (_, index) => countsByTrackedCode[index] === 0,
    ),
    countsByTrackedCode,
  };
};

export const exampleInput = {
  playCodes: ["TD", "FG", "TD", "PUNT"],
  trackedCodes: ["TD", "FG", "INT"],
} satisfies Input;
export const exampleOutput = {
  trackedPlayCount: 3,
  missingTrackedCodes: ["int"],
  countsByTrackedCode: [2, 1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      playCodes: input.playCodes as readonly string[],
      trackedCodes: input.trackedCodes as readonly string[],
    }),
  description:
    "Count selected play-by-play codes and identify absent tracked codes.",
  id: "journalism/play-by-play-code-count",
  inputs: [
    { id: "playCodes", label: "Play-by-play codes", kind: "stringList" },
    { id: "trackedCodes", label: "Codes to track", kind: "stringList" },
  ],
  outputs: [
    {
      id: "trackedPlayCount",
      label: "Tracked play count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "missingTrackedCodes",
      label: "Tracked codes not observed",
      kind: "stringList",
    },
    {
      id: "countsByTrackedCode",
      label: "Counts in tracked-code order",
      kind: "numberList",
    },
  ],
  title: "Play-by-Play Code Count",
});

export const run = tool.execute;
export default tool;
