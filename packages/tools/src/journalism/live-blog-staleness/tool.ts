import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lastUpdatedAt: string;
  readonly asOfAt: string;
  readonly staleAfterMinutes: number;
}>;
export type Output = Readonly<{
  readonly ageMinutes: number;
  readonly minutesBeyondThreshold: number;
  readonly stale: boolean;
}>;

export const calculate = (input: Input): Output => {
  const last = new Date(input.lastUpdatedAt),
    now = new Date(input.asOfAt);
  if (Number.isNaN(last.getTime()) || Number.isNaN(now.getTime()) || now < last)
    simpleError(
      "asOfAt",
      "Timestamps must be valid and ordered.",
      "invalid_timestamps",
    );
  const ageMinutes = (now.getTime() - last.getTime()) / 60000;
  return {
    ageMinutes,
    minutesBeyondThreshold: Math.max(0, ageMinutes - input.staleAfterMinutes),
    stale: ageMinutes > input.staleAfterMinutes,
  };
};

export const exampleInput = {
  lastUpdatedAt: "2025-01-01T12:00:00Z",
  asOfAt: "2025-01-01T12:45:00Z",
  staleAfterMinutes: 30,
} satisfies Input;
export const exampleOutput = {
  ageMinutes: 45,
  minutesBeyondThreshold: 15,
  stale: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lastUpdatedAt: input.lastUpdatedAt as string,
      asOfAt: input.asOfAt as string,
      staleAfterMinutes: input.staleAfterMinutes as number,
    }),
  description:
    "Measure live-blog update age against a supplied staleness threshold.",
  id: "journalism/live-blog-staleness",
  inputs: [
    { id: "lastUpdatedAt", label: "Last update timestamp", kind: "string" },
    { id: "asOfAt", label: "As-of timestamp", kind: "string" },
    {
      id: "staleAfterMinutes",
      label: "Staleness threshold",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
  ],
  outputs: [
    {
      id: "ageMinutes",
      label: "Update age",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    {
      id: "minutesBeyondThreshold",
      label: "Minutes beyond threshold",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    { id: "stale", label: "Update is stale", kind: "boolean" },
  ],
  title: "Live-Blog Staleness",
});

export const run = tool.execute;
export default tool;
