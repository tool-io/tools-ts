import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  normalSamplesSchema,
  drawSyntheticNormal,
} from "../synthetic-normal-construction.js";
import { runCumulativeSum } from "../../list/cumulative-sum/tool.js";
import { calculateMovingAverage } from "../../statistics/moving-average/tool.js";

export type TimeSeriesInput = {
  readonly count: number;
  readonly initialValue: number;
  readonly driftPerStep: number;
  readonly noiseStandardDeviationPerStep: number;
  readonly startTimeSeconds: number;
  readonly timeStepSeconds: number;
  readonly windowSize: number;
  readonly seed?: number;
};
export type TimeSeriesOutput = {
  readonly timesSeconds: readonly number[];
  readonly values: readonly number[];
  readonly increments: readonly number[];
  readonly smoothedTimesSeconds: readonly number[];
  readonly smoothedValues: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1, maximum: 2048 },
    initialValue: { type: "number" },
    driftPerStep: { type: "number" },
    noiseStandardDeviationPerStep: { type: "number", minimum: 0 },
    startTimeSeconds: {
      type: "number",
      description: "Explicit first sample time in seconds.",
    },
    timeStepSeconds: { type: "number", exclusiveMinimum: 0 },
    windowSize: { type: "integer", minimum: 1, maximum: 2048 },
    seed: generatorSeedSchema,
  },
  required: [
    "count",
    "initialValue",
    "driftPerStep",
    "noiseStandardDeviationPerStep",
    "startTimeSeconds",
    "timeStepSeconds",
    "windowSize",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timesSeconds: normalSamplesSchema,
    values: normalSamplesSchema,
    increments: { ...normalSamplesSchema, minItems: 0, maxItems: 2047 },
    smoothedTimesSeconds: normalSamplesSchema,
    smoothedValues: normalSamplesSchema,
    randomness: generatorReplaySchema,
  },
  required: [
    "timesSeconds",
    "values",
    "increments",
    "smoothedTimesSeconds",
    "smoothedValues",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is TimeSeriesInput =>
  matchesModelInput(input, inputSchema);
export const calculateTimeSeries = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TimeSeriesOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.windowSize > input.count)
      simpleError(
        "windowSize",
        "The moving-average window must fit the observation count.",
        "invalid_window",
      );
    const timesSeconds = Array.from(
      { length: input.count },
      (_, i) => input.startTimeSeconds + i * input.timeStepSeconds,
    );
    if (
      !timesSeconds.every(
        (time, i) =>
          Number.isFinite(time) && (i === 0 || time > timesSeconds[i - 1]),
      )
    )
      simpleError(
        "timeStepSeconds",
        "The requested seconds grid must stay finite and strictly increasing.",
        "unrepresentable_time_grid",
      );
    const random = createGeneratorRandom(input.seed, context);
    const increments = Array.from({ length: input.count - 1 }, () =>
      drawSyntheticNormal(
        input.driftPerStep,
        input.noiseStandardDeviationPerStep,
        random,
        "noiseStandardDeviationPerStep",
      ),
    );
    let offsets: readonly number[] = [];
    if (increments.length) {
      const cumulative = runCumulativeSum({ values: increments });
      if (!cumulative.ok)
        return simpleError(
          "driftPerStep",
          "Cumulative increments must remain finite.",
          "numeric_overflow",
        );
      offsets = cumulative.output.sums;
    }
    const values = [
      input.initialValue,
      ...offsets.map((offset) => input.initialValue + offset),
    ];
    if (!values.every(Number.isFinite))
      simpleError(
        "initialValue",
        "The generated cumulative series must remain finite.",
        "numeric_overflow",
      );
    const smoothedValues = calculateMovingAverage({
      values,
      windowSize: input.windowSize,
    }).averages;
    if (!smoothedValues.every(Number.isFinite))
      simpleError(
        "windowSize",
        "Moving-average arithmetic must remain finite.",
        "numeric_overflow",
      );
    return toolSuccess({
      timesSeconds,
      values,
      increments,
      smoothedTimesSeconds: timesSeconds.slice(input.windowSize - 1),
      smoothedValues,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const timeSeriesExample = {
  input: {
    count: 6,
    initialValue: 10,
    driftPerStep: 0.2,
    noiseStandardDeviationPerStep: 0.1,
    startTimeSeconds: 0,
    timeStepSeconds: 60,
    windowSize: 3,
    seed: 42,
  },
  output: {
    timesSeconds: [0, 60, 120, 180, 240, 300],
    values: [
      10, 10.104383777061585, 10.277081166573325, 10.292918448094964,
      10.378830240999562, 10.52588686162792,
    ],
    increments: [
      0.10438377706158511, 0.17269738951173896, 0.015837281521640323,
      0.08591179290459759, 0.14705662062835848,
    ],
    smoothedTimesSeconds: [120, 180, 240, 300],
    smoothedValues: [
      10.1271549812, 10.2247944639, 10.3162766186, 10.3992118502,
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<TimeSeriesInput, TimeSeriesOutput>;
export const timeSeriesTool = createModelDefinition<
  TimeSeriesInput,
  TimeSeriesOutput
>({
  id: "random/time-series",
  title: "Random Time Series Generator",
  description:
    "Generate a retained initial value followed by Gaussian drift/noise increments on an explicit increasing seconds grid, then delegate cumulative sums and trailing moving averages with the core's 12-digit convention; no forecast or real-process claim.",
  inputSchema,
  outputSchema,
  execute: calculateTimeSeries,
});
export const runTimeSeries = timeSeriesTool.execute;
export default timeSeriesTool;
