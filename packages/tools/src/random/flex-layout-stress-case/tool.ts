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
import { calculateFlexGrowSpaceDistribution } from "../../css/flex-grow-space-distribution/tool.js";
import { calculateFlexShrinkDeficitProportionalLoss } from "../../css/flex-shrink-deficit-proportional-loss/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  rangeSchema,
  drawInteger,
  orderedRange,
  coreOutput,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type FlexLayoutStressCaseInput = {
  readonly itemCount: number;
  readonly containerWidthPx: NumericRange;
  readonly basisPx: NumericRange;
  readonly grow: NumericRange;
  readonly shrink: NumericRange;
  readonly seed?: number;
};
export type FlexLayoutStressCaseOutput = {
  readonly containerWidthPx: number;
  readonly freeSpacePx: number;
  readonly mode: "grow" | "shrink";
  readonly items: readonly {
    readonly basisPx: number;
    readonly grow: number;
    readonly shrink: number;
    readonly adjustmentPx: number;
    readonly preliminarySizePx: number;
  }[];
  readonly remainingSpacePx: number;
  readonly randomness: GeneratorReplay;
};
const nonnegativeInteger = { type: "integer", minimum: 0 } as const;
export const inputSchema = objectSchema(
  {
    itemCount: countSchema(32),
    containerWidthPx: rangeSchema(nonnegativeInteger),
    basisPx: rangeSchema(nonnegativeInteger),
    grow: rangeSchema(nonnegativeInteger),
    shrink: rangeSchema(nonnegativeInteger),
    seed: generatorSeedSchema,
  },
  ["itemCount", "containerWidthPx", "basisPx", "grow", "shrink"],
);
export const outputSchema = objectSchema({
  containerWidthPx: numberSchema,
  freeSpacePx: numberSchema,
  mode: { type: "string", enum: ["grow", "shrink"] },
  items: arraySchema(
    objectSchema({
      basisPx: numberSchema,
      grow: numberSchema,
      shrink: numberSchema,
      adjustmentPx: numberSchema,
      preliminarySizePx: numberSchema,
    }),
    32,
    1,
  ),
  remainingSpacePx: numberSchema,
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is FlexLayoutStressCaseInput =>
  matchesModelInput(value, inputSchema);
export const calculateFlexLayoutStressCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FlexLayoutStressCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const field of [
      "containerWidthPx",
      "basisPx",
      "grow",
      "shrink",
    ] as const)
      orderedRange(input[field], field);
    const random = createGeneratorRandom(input.seed, context),
      containerWidthPx = drawInteger(
        input.containerWidthPx,
        random,
        "containerWidthPx",
      );
    const draws = Array.from({ length: input.itemCount }, () => ({
      basisPx: drawInteger(input.basisPx, random, "basisPx"),
      grow: drawInteger(input.grow, random, "grow"),
      shrink: drawInteger(input.shrink, random, "shrink"),
    }));
    const freeSpacePx =
        containerWidthPx - draws.reduce((s, item) => s + item.basisPx, 0),
      mode = freeSpacePx >= 0 ? "grow" : "shrink";
    let adjustments: readonly number[], remainingSpacePx: number;
    if (mode === "grow") {
      const result = coreOutput(
        calculateFlexGrowSpaceDistribution({
          freeSpace: freeSpacePx,
          growFactors: draws.map((x) => x.grow),
        }),
      );
      adjustments = result.allocations;
      remainingSpacePx = result.unallocatedSpace;
    } else {
      const result = coreOutput(
        calculateFlexShrinkDeficitProportionalLoss({
          deficit: -freeSpacePx,
          baseSizes: draws.map((x) => x.basisPx),
          shrinkFactors: draws.map((x) => x.shrink),
        }),
      );
      adjustments = result.losses.map((x) => (x === 0 ? 0 : -x));
      remainingSpacePx =
        result.undistributedDeficit === 0 ? 0 : -result.undistributedDeficit;
    }
    const items = draws.map((item, i) => ({
      ...item,
      adjustmentPx: adjustments[i],
      preliminarySizePx: item.basisPx + adjustments[i],
    }));
    return toolSuccess(
      ensureOutput(
        {
          containerWidthPx,
          freeSpacePx,
          mode,
          items,
          remainingSpacePx,
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const flexLayoutStressCaseExample = {
  input: {
    itemCount: 2,
    containerWidthPx: {
      minimum: 240,
      maximum: 240,
    },
    basisPx: {
      minimum: 100,
      maximum: 200,
    },
    grow: {
      minimum: 0,
      maximum: 2,
    },
    shrink: {
      minimum: 1,
      maximum: 1,
    },
    seed: 42,
  },
  output: {
    containerWidthPx: 240,
    freeSpacePx: -22,
    mode: "shrink",
    items: [
      {
        basisPx: 145,
        grow: 2,
        shrink: 1,
        adjustmentPx: -12.17557251908397,
        preliminarySizePx: 132.82442748091603,
      },
      {
        basisPx: 117,
        grow: 1,
        shrink: 1,
        adjustmentPx: -9.82442748091603,
        preliminarySizePx: 107.17557251908397,
      },
    ],
    remainingSpacePx: 0,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<FlexLayoutStressCaseInput, FlexLayoutStressCaseOutput>;
export const flexLayoutStressCaseTool = createModelDefinition<
  FlexLayoutStressCaseInput,
  FlexLayoutStressCaseOutput
>({
  id: "random/flex-layout-stress-case",
  title: "Random Flex Layout Stress Case Generator",
  description:
    "Generate flex bases and factors with delegated initial grow or shrink expectations before min-size freezing.",
  inputSchema,
  outputSchema,
  execute: calculateFlexLayoutStressCase,
});
export const runFlexLayoutStressCase = flexLayoutStressCaseTool.execute;
export default flexLayoutStressCaseTool;
