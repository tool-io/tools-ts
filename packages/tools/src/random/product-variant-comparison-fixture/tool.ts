import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateCartesianProduct } from "../../list/cartesian-product/tool.js";
import { runUnique } from "../../list/unique/tool.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksInteger,
  mocksBoolean,
  mocksDistinct,
  mocksPick,
  mocksCore,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type ProductVariantComparisonFixtureInput = {
  readonly axes: readonly {
    readonly name: string;
    readonly options: readonly string[];
  }[];
  readonly skuPrefix: string;
  readonly unavailableCount: number;
  readonly seed?: number;
};
export type ProductVariantComparisonFixtureOutput = {
  readonly variants: readonly {
    readonly sku: string;
    readonly attributes: readonly {
      readonly name: string;
      readonly value: string;
    }[];
    readonly available: boolean;
  }[];
  readonly totalCount: number;
  readonly availableCount: number;
  readonly unavailableCount: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = mocksObject(
  {
    axes: mocksArray(
      mocksObject({
        name: mocksLabel,
        options: mocksArray(mocksLabel, 128, 1),
      }),
      6,
      1,
    ),
    skuPrefix: { ...mocksLabel, maxLength: 96 },
    unavailableCount: { type: "integer", minimum: 0, maximum: 128 },
    seed: generatorSeedSchema,
  },
  ["axes", "skuPrefix", "unavailableCount"],
);
export const outputSchema = mocksObject({
  variants: mocksArray(
    mocksObject({
      sku: mocksLabel,
      attributes: mocksArray(
        mocksObject({ name: mocksLabel, value: mocksLabel }),
        6,
        1,
      ),
      available: mocksBoolean,
    }),
    128,
    1,
  ),
  totalCount: mocksInteger,
  availableCount: mocksInteger,
  unavailableCount: mocksInteger,
  randomness: generatorReplaySchema,
});
const generate = (
  input: ProductVariantComparisonFixtureInput,
  random: GeneratorRandom,
): Omit<ProductVariantComparisonFixtureOutput, "randomness"> => {
  mocksDistinct(
    input.axes.map((axis) => axis.name),
    "axes",
  );
  const axes = input.axes.map((axis) => ({
    name: axis.name,
    options: mocksCore(runUnique({ values: axis.options }), "axes").values,
  }));
  let combinations: number[][] = [[]];
  for (const axis of axes) {
    if (combinations.length * axis.options.length > 128)
      simpleError(
        "axes",
        "The Cartesian product exceeds 128 variants.",
        "resource_limit_exceeded",
      );
    const pairs = calculateCartesianProduct({
      first: combinations.map((_, i) => i),
      second: axis.options.map((_, i) => i),
    }).pairs;
    combinations = pairs.map((pair) => [...combinations[pair[0]], pair[1]]);
  }
  if (input.unavailableCount > combinations.length)
    simpleError(
      "unavailableCount",
      "Unavailable count exceeds the generated combinations.",
      "infeasible_unavailable_count",
    );
  const remaining = combinations.map((_, i) => i),
    unavailable = new Set<number>();
  for (let i = 0; i < input.unavailableCount; i += 1) {
    const chosen = mocksPick(remaining, random);
    unavailable.add(chosen);
    remaining.splice(remaining.indexOf(chosen), 1);
  }
  // Consume one checked draw even when every variant is available, keeping injected source diagnostics meaningful.
  if (input.unavailableCount === 0) random.unit();
  const variants = combinations.map((indices, i) => ({
    sku: input.skuPrefix + "-" + (i + 1),
    attributes: axes.map((axis, j) => ({
      name: axis.name,
      value: axis.options[indices[j]],
    })),
    available: !unavailable.has(i),
  }));
  return {
    variants,
    totalCount: variants.length,
    availableCount: variants.length - unavailable.size,
    unavailableCount: unavailable.size,
  };
};
export const productVariantComparisonFixtureExample = {
  input: {
    axes: [
      { name: "size", options: ["S", "M"] },
      { name: "color", options: ["red", "blue"] },
    ],
    skuPrefix: "DEMO",
    unavailableCount: 2,
    seed: 42,
  },
  output: {
    variants: [
      {
        sku: "DEMO-1",
        attributes: [
          { name: "size", value: "S" },
          { name: "color", value: "red" },
        ],
        available: true,
      },
      {
        sku: "DEMO-2",
        attributes: [
          { name: "size", value: "S" },
          { name: "color", value: "blue" },
        ],
        available: false,
      },
      {
        sku: "DEMO-3",
        attributes: [
          { name: "size", value: "M" },
          { name: "color", value: "red" },
        ],
        available: false,
      },
      {
        sku: "DEMO-4",
        attributes: [
          { name: "size", value: "M" },
          { name: "color", value: "blue" },
        ],
        available: true,
      },
    ],
    totalCount: 4,
    availableCount: 2,
    unavailableCount: 2,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  ProductVariantComparisonFixtureInput,
  ProductVariantComparisonFixtureOutput
>;

const isInput = (
  input: unknown,
): input is ProductVariantComparisonFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateProductVariantComparisonFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ProductVariantComparisonFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const productVariantComparisonFixtureTool = createModelDefinition<
  ProductVariantComparisonFixtureInput,
  ProductVariantComparisonFixtureOutput
>({
  id: "random/product-variant-comparison-fixture",
  title: "Random Product Variant Comparison Fixture Generator",
  description:
    "Construct every bounded supplied attribute combination with synthetic ordinal SKUs and an exact randomly chosen unavailable subset.",
  inputSchema,
  outputSchema,
  execute: calculateProductVariantComparisonFixture,
});
export const runProductVariantComparisonFixture =
  productVariantComparisonFixtureTool.execute;
export default productVariantComparisonFixtureTool;
