import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedMarkers: readonly string[];
  readonly callerFlaggedMarkers: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchedMarkers: readonly string[];
  readonly matchedCount: number;
}>;
export const calculate = (input: Input): Output => {
  if (new Set(input.observedMarkers).size !== input.observedMarkers.length)
    simpleError(
      "observedMarkers",
      "Distinct observed marker annotations required.",
    );
  const flagged = new Set(input.callerFlaggedMarkers),
    matchedMarkers = input.observedMarkers.filter((v) => flagged.has(v));
  return { matchedMarkers, matchedCount: matchedMarkers.length };
};
export const exampleInput = {
  observedMarkers: ["C580Y", "A578S"],
  callerFlaggedMarkers: ["C580Y", "R539T"],
} satisfies Input;
export const exampleOutput = {
  matchedMarkers: ["C580Y"],
  matchedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/k13-marker-match",
  title: "K13 Marker Match",
  description:
    "Match observed K13 marker annotations against a caller-supplied concern set; no embedded resistance catalog.",
  inputs: [
    { id: "observedMarkers", label: "Observed markers", kind: "stringList" },
    {
      id: "callerFlaggedMarkers",
      label: "Caller flagged markers",
      kind: "stringList",
    },
  ],
  outputs: [
    { id: "matchedMarkers", label: "Matched markers", kind: "stringList" },
    { id: "matchedCount", label: "Matched count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedMarkers: value.observedMarkers as readonly string[],
      callerFlaggedMarkers: value.callerFlaggedMarkers as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
