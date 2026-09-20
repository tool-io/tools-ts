import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateSlidingWindow } from "../../list/sliding-window/tool.js";
import { runMean } from "../../statistics/mean/tool.js";
import {
  arraySchema,
  objectSchema,
  integerSchema,
  countSchema,
  nullableSchema,
  ordered,
  safeInteger,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";

export type RollingWindowAggregateTraceInput = {
  readonly length: number;
  readonly windowSize: number;
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly seed?: number;
};
type WindowEvent = {
  readonly start: number;
  readonly endExclusive: number;
  readonly values: readonly number[];
  readonly sum: number;
  readonly mean: number | null;
  readonly minimum: number | null;
  readonly maximum: number | null;
};
export type RollingWindowAggregateTraceOutput = {
  readonly stream: readonly number[];
  readonly events: readonly WindowEvent[];
  readonly fullWindows: readonly (readonly number[])[];
  readonly randomness: GeneratorReplay;
};
const windowSchema = arraySchema(integerSchema, 16);
export const inputSchema = objectSchema(
  {
    length: countSchema(64),
    windowSize: countSchema(16, 1),
    minimumValue: integerSchema,
    maximumValue: integerSchema,
    seed: generatorSeedSchema,
  },
  ["length", "windowSize", "minimumValue", "maximumValue"],
);
export const outputSchema = objectSchema({
  stream: arraySchema(integerSchema, 64),
  events: arraySchema(
    objectSchema({
      start: countSchema(64),
      endExclusive: countSchema(64),
      values: windowSchema,
      sum: integerSchema,
      mean: nullableSchema({ type: "number" }),
      minimum: nullableSchema(integerSchema),
      maximum: nullableSchema(integerSchema),
    }),
    65,
    1,
  ),
  fullWindows: arraySchema(windowSchema, 64),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is RollingWindowAggregateTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateRollingWindowAggregateTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RollingWindowAggregateTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    ordered(input.minimumValue, input.maximumValue);
    const random = createGeneratorRandom(input.seed, context),
      stream = Array.from({ length: input.length }, () =>
        random.integer(input.minimumValue, input.maximumValue),
      );
    const events = Array.from(
      { length: input.length + 1 },
      (_, endExclusive): WindowEvent => {
        const start = Math.max(0, endExclusive - input.windowSize),
          values = stream.slice(start, endExclusive),
          sum = safeInteger(
            values.reduce((total, value) => total + BigInt(value), 0n),
            "windowSize",
          );
        return {
          start,
          endExclusive,
          values,
          sum,
          mean: values.length
            ? coreOutput(runMean({ values })).mean || 0
            : null,
          minimum: values.length ? Math.min(...values) : null,
          maximum: values.length ? Math.max(...values) : null,
        };
      },
    );
    const fullWindows =
      input.length >= input.windowSize
        ? calculateSlidingWindow({
            values: stream,
            windowSize: input.windowSize,
          }).windows
        : [];
    return toolSuccess({
      stream,
      events,
      fullWindows,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const rollingWindowAggregateTraceExample = {
  input: {
    length: 3,
    windowSize: 2,
    minimumValue: 1,
    maximumValue: 4,
    seed: 42,
  },
  output: {
    stream: [3, 2, 4],
    events: [
      {
        start: 0,
        endExclusive: 0,
        values: [],
        sum: 0,
        mean: null,
        minimum: null,
        maximum: null,
      },
      {
        start: 0,
        endExclusive: 1,
        values: [3],
        sum: 3,
        mean: 3,
        minimum: 3,
        maximum: 3,
      },
      {
        start: 0,
        endExclusive: 2,
        values: [3, 2],
        sum: 5,
        mean: 2.5,
        minimum: 2,
        maximum: 3,
      },
      {
        start: 1,
        endExclusive: 3,
        values: [2, 4],
        sum: 6,
        mean: 3,
        minimum: 2,
        maximum: 4,
      },
    ],
    fullWindows: [
      [3, 2],
      [2, 4],
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  RollingWindowAggregateTraceInput,
  RollingWindowAggregateTraceOutput
>;
export const rollingWindowAggregateTraceTool = createModelDefinition<
  RollingWindowAggregateTraceInput,
  RollingWindowAggregateTraceOutput
>({
  id: "random/rolling-window-aggregate-trace",
  title: "Random Rolling Window Aggregate Trace Generator",
  description:
    "Generate an integer stream with empty, partial and full trailing-window answer states, exact safe sums and delegated full windows and Number-arithmetic means; empty extrema and means are null.",
  inputSchema,
  outputSchema,
  execute: calculateRollingWindowAggregateTrace,
});
export const runRollingWindowAggregateTrace =
  rollingWindowAggregateTraceTool.execute;
export default rollingWindowAggregateTraceTool;
