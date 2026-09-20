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
import { randomNormal } from "../../probability/normal-box-muller-sampler/tool.js";

export type ViolinDensityShapeDatasetInput = {
  readonly components: readonly {
    readonly mean: number;
    readonly standardDeviation: number;
    readonly weight: number;
  }[];
  readonly count: number;
  readonly seed?: number;
};
export type ViolinDensityShapeDatasetOutput = {
  readonly components: readonly {
    readonly mean: number;
    readonly standardDeviation: number;
    readonly weight: number;
  }[];
  readonly observations: readonly {
    readonly componentIndex: number;
    readonly value: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    components: array(
      object({
        mean: number,
        standardDeviation: { type: "number", minimum: 0 },
        weight: { type: "number", minimum: 0 },
      }),
      8,
      1,
    ),
    count: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  ["components", "count"],
);
export const outputSchema = object({
  components: array(
    object({ mean: number, standardDeviation: number, weight: number }),
    8,
    1,
  ),
  observations: array(
    object({ componentIndex: integer, value: number }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is ViolinDensityShapeDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateViolinDensityShapeDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ViolinDensityShapeDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const largest = Math.max(...input.components.map((c) => c.weight));
    if (largest === 0)
      simpleError(
        "components",
        "At least one weight must be positive.",
        "zero_total_weight",
      );
    const weights = input.components.map((c) => c.weight / largest),
      total = sum(weights),
      observations = Array.from({ length: input.count }, () => {
        let cursor = random.unit() * total,
          componentIndex = weights.length - 1;
        for (let i = 0; i < weights.length; i++) {
          cursor -= weights[i];
          if (cursor < 0) {
            componentIndex = i;
            break;
          }
        }
        const c = input.components[componentIndex],
          z = randomNormal(random.unit);
        if (z === null) throw new Error("Checked normal draws were rejected");
        return {
          componentIndex,
          value: finite(c.mean + c.standardDeviation * z, "components"),
        };
      });
    const result = {
      components: input.components.map((c) => ({ ...c })),
      observations,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const violinDensityShapeDatasetExample = {
  input: {
    components: [
      { mean: 0, standardDeviation: 1, weight: 1 },
      { mean: 10, standardDeviation: 2, weight: 1 },
    ],
    count: 1,
    seed: 42,
  },
  output: {
    components: [
      { mean: 0, standardDeviation: 1, weight: 1 },
      { mean: 10, standardDeviation: 2, weight: 1 },
    ],
    observations: [{ componentIndex: 1, value: 11.520715809172257 }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ViolinDensityShapeDatasetInput,
  ViolinDensityShapeDatasetOutput
>;
export const violinDensityShapeDatasetTool = createModelDefinition<
  ViolinDensityShapeDatasetInput,
  ViolinDensityShapeDatasetOutput
>({
  id: "random/violin-density-shape-dataset",
  title: "Random Violin Density Shape Dataset Generator",
  description:
    "Sample a supplied normal mixture using one advancing checked source and retain component truth; density estimation and bandwidth selection are separate.",
  inputSchema,
  outputSchema,
  execute: calculateViolinDensityShapeDataset,
});
export const runViolinDensityShapeDataset =
  violinDensityShapeDatasetTool.execute;
export default violinDensityShapeDatasetTool;
