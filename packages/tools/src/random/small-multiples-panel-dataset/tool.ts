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
import { runMean } from "../../statistics/mean/tool.js";

export type SmallMultiplesPanelDatasetInput = {
  readonly baseline: readonly number[];
  readonly panels: readonly string[];
  readonly offsets: readonly number[];
  readonly jitter: number;
  readonly unit: string;
  readonly seed?: number;
};
export type SmallMultiplesPanelDatasetOutput = {
  readonly panels: readonly {
    readonly id: string;
    readonly values: readonly number[];
    readonly mean: number;
    readonly offset: number;
  }[];
  readonly minimum: number;
  readonly maximum: number;
  readonly unit: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    baseline: array(integer, 16, 1),
    panels: array(label, 8, 1),
    offsets: array(integer, 8, 1),
    jitter: { type: "integer", minimum: 0, maximum: 1000000 },
    unit: label,
    seed: generatorSeedSchema,
  },
  ["baseline", "panels", "offsets", "jitter", "unit"],
);
export const outputSchema = object({
  panels: array(
    object({
      id: label,
      values: array(integer, 16, 1),
      mean: number,
      offset: integer,
    }),
    8,
    1,
  ),
  minimum: number,
  maximum: number,
  unit: label,
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is SmallMultiplesPanelDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateSmallMultiplesPanelDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SmallMultiplesPanelDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.panels, "panels");
    if (input.panels.length !== input.offsets.length)
      simpleError(
        "offsets",
        "One offset is required per panel.",
        "shape_mismatch",
      );
    for (const v of input.baseline)
      for (const offset of input.offsets) {
        safe(v + offset - input.jitter, "offsets");
        safe(v + offset + input.jitter, "offsets");
      }
    const panels = input.panels.map((id, i) => {
        const values = input.baseline.map((v) =>
          safe(
            v + input.offsets[i] + random.integer(-input.jitter, input.jitter),
          ),
        );
        return {
          id,
          values,
          mean: finite(core(runMean({ values })).mean),
          offset: input.offsets[i],
        };
      }),
      flat = panels.flatMap((p) => p.values);
    const result = {
      panels,
      minimum: Math.min(...flat),
      maximum: Math.max(...flat),
      unit: input.unit,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const smallMultiplesPanelDatasetExample = {
  input: {
    baseline: [2, 4],
    panels: ["a", "b"],
    offsets: [0, 3],
    jitter: 1,
    unit: "items",
    seed: 42,
  },
  output: {
    panels: [
      { id: "a", values: [2, 4], mean: 3, offset: 0 },
      { id: "b", values: [6, 8], mean: 7, offset: 3 },
    ],
    minimum: 2,
    maximum: 8,
    unit: "items",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SmallMultiplesPanelDatasetInput,
  SmallMultiplesPanelDatasetOutput
>;
export const smallMultiplesPanelDatasetTool = createModelDefinition<
  SmallMultiplesPanelDatasetInput,
  SmallMultiplesPanelDatasetOutput
>({
  id: "random/small-multiples-panel-dataset",
  title: "Random Small Multiples Panel Dataset Generator",
  description:
    "Generate related synthetic panels from a shared series with declared units, per-panel offsets, jitter and one common scale.",
  inputSchema,
  outputSchema,
  execute: calculateSmallMultiplesPanelDataset,
});
export const runSmallMultiplesPanelDataset =
  smallMultiplesPanelDatasetTool.execute;
export default smallMultiplesPanelDatasetTool;
