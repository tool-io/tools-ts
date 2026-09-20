import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import { runCumulativeSum } from "../../list/cumulative-sum/tool.js";

export type WaterfallChangeDatasetInput = {
  readonly opening: number;
  readonly minimumChange: number;
  readonly maximumChange: number;
  readonly count: number;
  readonly subtotalAfter: readonly number[];
  readonly seed?: number;
};
export type WaterfallChangeDatasetOutput = {
  readonly changes: readonly number[];
  readonly closing: number;
  readonly bars: readonly {
    readonly kind: "change" | "subtotal";
    readonly after: number;
    readonly from: number;
    readonly to: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    opening: integer,
    minimumChange: integer,
    maximumChange: integer,
    count: { type: "integer", minimum: 1, maximum: 32 },
    subtotalAfter: array({ type: "integer", minimum: 1, maximum: 32 }, 32),
    seed: generatorSeedSchema,
  },
  ["opening", "minimumChange", "maximumChange", "count", "subtotalAfter"],
);
export const outputSchema = object({
  changes: array(integer, 32, 1),
  closing: integer,
  bars: array(
    object({
      kind: { type: "string", enum: ["change", "subtotal"] },
      after: integer,
      from: integer,
      to: integer,
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is WaterfallChangeDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateWaterfallChangeDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WaterfallChangeDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (input.minimumChange > input.maximumChange)
      simpleError(
        "maximumChange",
        "Change range must be ordered.",
        "invalid_range",
      );
    distinct(input.subtotalAfter, "subtotalAfter");
    if (input.subtotalAfter.some((p) => p > input.count))
      simpleError(
        "subtotalAfter",
        "Subtotal position exceeds change count.",
        "invalid_position",
      );
    const changes = Array.from({ length: input.count }, () =>
      random.integer(input.minimumChange, input.maximumChange),
    );
    let total = BigInt(input.opening);
    for (const v of changes) {
      total += BigInt(v);
      if (
        total > BigInt(Number.MAX_SAFE_INTEGER) ||
        total < BigInt(Number.MIN_SAFE_INTEGER)
      )
        simpleError(
          "opening",
          "Cumulative total is unsafe.",
          "unsafe_arithmetic",
        );
    }
    const sums = core(
      runCumulativeSum({ values: [input.opening, ...changes] }),
    ).sums;
    const bars: {
      kind: "change" | "subtotal";
      after: number;
      from: number;
      to: number;
    }[] = [];
    changes.forEach((_, i) => {
      bars.push({
        kind: "change",
        after: i + 1,
        from: finite(sums[i]),
        to: finite(sums[i + 1]),
      });
      if (input.subtotalAfter.includes(i + 1))
        bars.push({
          kind: "subtotal",
          after: i + 1,
          from: 0,
          to: finite(sums[i + 1]),
        });
    });
    const result = { changes, closing: finite(sums[input.count]), bars };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const waterfallChangeDatasetExample = {
  input: {
    opening: 10,
    minimumChange: -2,
    maximumChange: 3,
    count: 2,
    subtotalAfter: [2],
    seed: 42,
  },
  output: {
    changes: [1, 0],
    closing: 11,
    bars: [
      { kind: "change", after: 1, from: 10, to: 11 },
      { kind: "change", after: 2, from: 11, to: 11 },
      { kind: "subtotal", after: 2, from: 0, to: 11 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  WaterfallChangeDatasetInput,
  WaterfallChangeDatasetOutput
>;
export const waterfallChangeDatasetTool = createModelDefinition<
  WaterfallChangeDatasetInput,
  WaterfallChangeDatasetOutput
>({
  id: "random/waterfall-change-dataset",
  title: "Random Waterfall Change Dataset Generator",
  description:
    "Generate bounded signed changes with cumulative opening/closing reconciliation and explicit subtotal bars.",
  inputSchema,
  outputSchema,
  execute: calculateWaterfallChangeDataset,
});
export const runWaterfallChangeDataset = waterfallChangeDatasetTool.execute;
export default waterfallChangeDatasetTool;
