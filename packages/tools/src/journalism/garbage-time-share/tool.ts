import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly totalGameSeconds: number;
  readonly garbageTimeSeconds: number;
  readonly totalPlays: number;
  readonly garbageTimePlays: number;
}>;
export type Output = Readonly<{
  readonly garbageTimeSharePercent: number;
  readonly garbagePlaySharePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.totalGameSeconds <= 0 ||
    input.totalPlays <= 0 ||
    input.garbageTimeSeconds > input.totalGameSeconds ||
    input.garbageTimePlays > input.totalPlays
  )
    simpleError(
      "totalGameSeconds",
      "Totals must be positive and not less than garbage-time values.",
      "invalid_totals",
    );
  return {
    garbageTimeSharePercent:
      (input.garbageTimeSeconds / input.totalGameSeconds) * 100,
    garbagePlaySharePercent: (input.garbageTimePlays / input.totalPlays) * 100,
  };
};

export const exampleInput = {
  totalGameSeconds: 3600,
  garbageTimeSeconds: 900,
  totalPlays: 100,
  garbageTimePlays: 20,
} satisfies Input;
export const exampleOutput = {
  garbageTimeSharePercent: 25,
  garbagePlaySharePercent: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      totalGameSeconds: input.totalGameSeconds as number,
      garbageTimeSeconds: input.garbageTimeSeconds as number,
      totalPlays: input.totalPlays as number,
      garbageTimePlays: input.garbageTimePlays as number,
    }),
  description: "Calculate garbage-time shares of game duration and plays.",
  id: "journalism/garbage-time-share",
  inputs: [
    {
      id: "totalGameSeconds",
      label: "Total game duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "garbageTimeSeconds",
      label: "Garbage-time duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    { id: "totalPlays", label: "Total plays", kind: "integer", minimum: 0 },
    {
      id: "garbageTimePlays",
      label: "Garbage-time plays",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "garbageTimeSharePercent",
      label: "Garbage-time duration share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "garbagePlaySharePercent",
      label: "Garbage-time play share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Garbage-Time Share",
});

export const run = tool.execute;
export default tool;
