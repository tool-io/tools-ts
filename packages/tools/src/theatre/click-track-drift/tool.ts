import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly expectedTempoBpm: number;
  readonly measuredBeatCount: number;
  readonly measuredDurationSeconds: number;
  readonly maximumTempoErrorBpm: number;
}>;
export type Output = Readonly<{
  readonly measuredTempoBpm: number;
  readonly tempoErrorBpm: number;
  readonly driftSecondsPerMinute: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.expectedTempoBpm <= 0 || input.measuredDurationSeconds <= 0)
    simpleError(
      "expectedTempoBpm",
      "Tempo and duration must be positive.",
      "invalid_tempo",
    );
  const measuredTempoBpm =
      (input.measuredBeatCount / input.measuredDurationSeconds) * 60,
    tempoErrorBpm = measuredTempoBpm - input.expectedTempoBpm;
  return {
    measuredTempoBpm,
    tempoErrorBpm,
    driftSecondsPerMinute: 60 * (input.expectedTempoBpm / measuredTempoBpm - 1),
    withinTolerance: Math.abs(tempoErrorBpm) <= input.maximumTempoErrorBpm,
  };
};

export const exampleInput = {
  expectedTempoBpm: 120,
  measuredBeatCount: 120,
  measuredDurationSeconds: 60,
  maximumTempoErrorBpm: 1,
} satisfies Input;
export const exampleOutput = {
  measuredTempoBpm: 120,
  tempoErrorBpm: 0,
  driftSecondsPerMinute: 0,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      expectedTempoBpm: input.expectedTempoBpm as number,
      measuredBeatCount: input.measuredBeatCount as number,
      measuredDurationSeconds: input.measuredDurationSeconds as number,
      maximumTempoErrorBpm: input.maximumTempoErrorBpm as number,
    }),
  description: "Measure click-track tempo and timing drift.",
  id: "theatre/click-track-drift",
  inputs: [
    {
      id: "expectedTempoBpm",
      label: "Expected tempo",
      kind: "number",
      minimum: 0,
      unit: "bpm",
    },
    {
      id: "measuredBeatCount",
      label: "Measured beat count",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "measuredDurationSeconds",
      label: "Measured duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "maximumTempoErrorBpm",
      label: "Maximum tempo error",
      kind: "number",
      minimum: 0,
      unit: "bpm",
    },
  ],
  outputs: [
    {
      id: "measuredTempoBpm",
      label: "Measured tempo",
      kind: "number",
      minimum: 0,
      unit: "bpm",
    },
    { id: "tempoErrorBpm", label: "Tempo error", kind: "number", unit: "bpm" },
    {
      id: "driftSecondsPerMinute",
      label: "Timing drift per minute",
      kind: "number",
      unit: "s/min",
    },
    {
      id: "withinTolerance",
      label: "Within supplied tolerance",
      kind: "boolean",
    },
  ],
  title: "Click-Track Drift",
});

export const run = tool.execute;
export default tool;
