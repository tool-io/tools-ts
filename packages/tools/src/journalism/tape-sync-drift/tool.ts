import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly referenceDurationSeconds: number;
  readonly syncedDurationSeconds: number;
  readonly maximumDriftMilliseconds: number;
}>;
export type Output = Readonly<{
  readonly driftMilliseconds: number;
  readonly absoluteDriftMilliseconds: number;
  readonly driftPartsPerMillion: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.referenceDurationSeconds <= 0)
    simpleError(
      "referenceDurationSeconds",
      "Reference duration must be positive.",
      "invalid_duration",
    );
  const driftMilliseconds =
    (input.syncedDurationSeconds - input.referenceDurationSeconds) * 1000;
  return {
    driftMilliseconds,
    absoluteDriftMilliseconds: Math.abs(driftMilliseconds),
    driftPartsPerMillion:
      ((input.syncedDurationSeconds - input.referenceDurationSeconds) /
        input.referenceDurationSeconds) *
      1e6,
    withinTolerance:
      Math.abs(driftMilliseconds) <= input.maximumDriftMilliseconds,
  };
};

export const exampleInput = {
  referenceDurationSeconds: 100,
  syncedDurationSeconds: 100.01,
  maximumDriftMilliseconds: 20,
} satisfies Input;
export const exampleOutput = {
  driftMilliseconds: 10.000000000005116,
  absoluteDriftMilliseconds: 10.000000000005116,
  driftPartsPerMillion: 100.00000000005116,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      referenceDurationSeconds: input.referenceDurationSeconds as number,
      syncedDurationSeconds: input.syncedDurationSeconds as number,
      maximumDriftMilliseconds: input.maximumDriftMilliseconds as number,
    }),
  description: "Measure tape-sync duration drift against a supplied tolerance.",
  id: "journalism/tape-sync-drift",
  inputs: [
    {
      id: "referenceDurationSeconds",
      label: "Reference recording duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "syncedDurationSeconds",
      label: "Synced recording duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "maximumDriftMilliseconds",
      label: "Maximum drift",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
  ],
  outputs: [
    {
      id: "driftMilliseconds",
      label: "End-to-end sync drift",
      kind: "number",
      unit: "ms",
    },
    {
      id: "absoluteDriftMilliseconds",
      label: "Absolute sync drift",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "driftPartsPerMillion",
      label: "Duration drift",
      kind: "number",
      unit: "ppm",
    },
    {
      id: "withinTolerance",
      label: "Within supplied tolerance",
      kind: "boolean",
    },
  ],
  title: "Tape-Sync Drift",
});

export const run = tool.execute;
export default tool;
