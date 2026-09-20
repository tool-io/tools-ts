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
import { calculateCircle } from "../../geometry/circle/tool.js";

export type BubbleSizeScaleDatasetInput = {
  readonly values: readonly number[];
  readonly count: number;
  readonly encoding: "radius" | "area";
  readonly negativePolicy: "reject" | "absolute";
  readonly scale: number;
  readonly seed?: number;
};
export type BubbleSizeScaleDatasetOutput = {
  readonly bubbles: readonly {
    readonly value: number;
    readonly magnitude: number;
    readonly radius: number;
    readonly area: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    values: array(number, 32, 1),
    count: { type: "integer", minimum: 1, maximum: 32 },
    encoding: { type: "string", enum: ["radius", "area"] },
    negativePolicy: { type: "string", enum: ["reject", "absolute"] },
    scale: { type: "number", exclusiveMinimum: 0 },
    seed: generatorSeedSchema,
  },
  ["values", "count", "encoding", "negativePolicy", "scale"],
);
export const outputSchema = object({
  bubbles: array(
    object({ value: number, magnitude: number, radius: number, area: number }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is BubbleSizeScaleDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateBubbleSizeScaleDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BubbleSizeScaleDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (input.negativePolicy === "reject" && input.values.some((v) => v < 0))
      simpleError(
        "values",
        "Negative values require the absolute policy.",
        "negative_value",
      );
    const bubbles = Array.from({ length: input.count }, () => {
      const value = finite(random.pick(input.values)),
        magnitude = Math.abs(value),
        encoded = finite(magnitude * input.scale, "scale");
      const c = calculateCircle(
        input.encoding === "area" ? { area: encoded } : { radius: encoded },
      );
      if (c === null)
        return simpleError(
          "scale",
          "The encoded circle exceeds finite range.",
          "nonfinite_arithmetic",
        );
      return {
        value,
        magnitude,
        radius: finite(c.radius),
        area: finite(c.area),
      };
    });
    const result = { bubbles };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const bubbleSizeScaleDatasetExample = {
  input: {
    values: [0, 4, 9],
    count: 2,
    encoding: "radius",
    negativePolicy: "reject",
    scale: 1,
    seed: 42,
  },
  output: {
    bubbles: [
      { value: 4, magnitude: 4, radius: 4, area: 50.26548245743669 },
      { value: 4, magnitude: 4, radius: 4, area: 50.26548245743669 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BubbleSizeScaleDatasetInput,
  BubbleSizeScaleDatasetOutput
>;
export const bubbleSizeScaleDatasetTool = createModelDefinition<
  BubbleSizeScaleDatasetInput,
  BubbleSizeScaleDatasetOutput
>({
  id: "random/bubble-size-scale-dataset",
  title: "Random Bubble Size Scale Dataset Generator",
  description:
    "Sample supplied values into explicit radius or area encodings with zero support and a declared negative-value policy.",
  inputSchema,
  outputSchema,
  execute: calculateBubbleSizeScaleDataset,
});
export const runBubbleSizeScaleDataset = bubbleSizeScaleDatasetTool.execute;
export default bubbleSizeScaleDatasetTool;
