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
import { runMinimum } from "../../statistics/minimum/tool.js";
import { runMaximum } from "../../statistics/maximum/tool.js";

export type RadarAxisComparisonDatasetInput = {
  readonly axes: readonly {
    readonly id: string;
    readonly minimum: number;
    readonly maximum: number;
  }[];
  readonly profiles: readonly string[];
  readonly missingProbability: number;
  readonly seed?: number;
};
export type RadarAxisComparisonDatasetOutput = {
  readonly values: readonly (readonly (number | null)[])[];
  readonly normalized: readonly (readonly (number | null)[])[];
  readonly axes: readonly {
    readonly id: string;
    readonly minimum: number;
    readonly maximum: number;
    readonly observedMinimum: number | null;
    readonly observedMaximum: number | null;
  }[];
  readonly profiles: readonly string[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    axes: array(
      object({ id: label, minimum: integer, maximum: integer }),
      8,
      3,
    ),
    profiles: array(label, 8, 1),
    missingProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  ["axes", "profiles", "missingProbability"],
);
export const outputSchema = object({
  values: array(array({ anyOf: [number, { type: "null" }] }, 8, 3), 8, 1),
  normalized: array(array({ anyOf: [number, { type: "null" }] }, 8, 3), 8, 1),
  axes: array(
    object({
      id: label,
      minimum: number,
      maximum: number,
      observedMinimum: { anyOf: [number, { type: "null" }] },
      observedMaximum: { anyOf: [number, { type: "null" }] },
    }),
    8,
    3,
  ),
  profiles: array(label, 8, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is RadarAxisComparisonDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateRadarAxisComparisonDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RadarAxisComparisonDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(
      input.axes.map((a) => a.id),
      "axes",
    );
    distinct(input.profiles, "profiles");
    for (const a of input.axes)
      if (
        a.minimum >= a.maximum ||
        !Number.isSafeInteger(a.maximum - a.minimum + 1)
      )
        simpleError(
          "axes",
          "Each axis needs an ordered nonzero safe range.",
          "invalid_range",
        );
    const values = input.profiles.map(() =>
      input.axes.map((a) =>
        random.unit() < input.missingProbability
          ? null
          : random.integer(a.minimum, a.maximum),
      ),
    );
    const normalized = values.map((row) =>
      row.map((v, i) =>
        v === null
          ? null
          : finite(
              (v - input.axes[i].minimum) /
                (input.axes[i].maximum - input.axes[i].minimum),
            ),
      ),
    );
    const axes = input.axes.map((a, i) => {
      const observed = values
        .map((row) => row[i])
        .filter((v): v is number => v !== null);
      return {
        ...a,
        observedMinimum: observed.length
          ? core(runMinimum({ values: observed })).minimum
          : null,
        observedMaximum: observed.length
          ? core(runMaximum({ values: observed })).maximum
          : null,
      };
    });
    const result = { values, normalized, axes, profiles: [...input.profiles] };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const radarAxisComparisonDatasetExample = {
  input: {
    axes: [
      { id: "a", minimum: 0, maximum: 10 },
      { id: "b", minimum: 0, maximum: 20 },
      { id: "c", minimum: 0, maximum: 4 },
    ],
    profiles: ["p"],
    missingProbability: 0,
    seed: 42,
  },
  output: {
    values: [[4, 14, 2]],
    normalized: [[0.4, 0.7, 0.5]],
    axes: [
      {
        id: "a",
        minimum: 0,
        maximum: 10,
        observedMinimum: 4,
        observedMaximum: 4,
      },
      {
        id: "b",
        minimum: 0,
        maximum: 20,
        observedMinimum: 14,
        observedMaximum: 14,
      },
      {
        id: "c",
        minimum: 0,
        maximum: 4,
        observedMinimum: 2,
        observedMaximum: 2,
      },
    ],
    profiles: ["p"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  RadarAxisComparisonDatasetInput,
  RadarAxisComparisonDatasetOutput
>;
export const radarAxisComparisonDatasetTool = createModelDefinition<
  RadarAxisComparisonDatasetInput,
  RadarAxisComparisonDatasetOutput
>({
  id: "random/radar-axis-comparison-dataset",
  title: "Random Radar Axis Comparison Dataset Generator",
  description:
    "Generate synthetic radar profiles on supplied integer scales with explicit missing masks, normalized positions and observed axis extrema.",
  inputSchema,
  outputSchema,
  execute: calculateRadarAxisComparisonDataset,
});
export const runRadarAxisComparisonDataset =
  radarAxisComparisonDatasetTool.execute;
export default radarAxisComparisonDatasetTool;
