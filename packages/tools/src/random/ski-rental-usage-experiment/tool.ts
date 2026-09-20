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
import { simpleError } from "../../core/simple.js";
import {
  demonstrateSkiRental,
  type SkiRentalResult,
} from "../../online-algorithm/ski-rental/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  arraySchema,
  objectSchema,
  integerSchema,
  numberSchema,
  safeRange,
  finite,
} from "../m250-algorithms-common.js";

export type SkiRentalUsageExperimentInput = {
  readonly count: number;
  readonly minimumDays: number;
  readonly maximumDays: number;
  readonly distribution: "uniform" | "censored-geometric";
  readonly stopProbability?: number;
  readonly rentalCost: number;
  readonly purchaseCost: number;
  readonly seed?: number;
};
export type SkiRentalUsageExperimentOutput = {
  readonly trials: readonly {
    readonly usageDays: number;
    readonly result: SkiRentalResult;
    readonly ratio: number;
  }[];
  readonly meanOnlineCost: number;
  readonly meanOptimalCost: number;
  readonly worstObservedRatio: number;
  readonly convention: string;
  readonly randomness: GeneratorReplay;
};
const positiveNumber = { type: "number", exclusiveMinimum: 0 } as const;
const resultSchema = objectSchema({
  competitiveRatio: numberSchema,
  decision: { type: "string" },
  onlineCost: numberSchema,
  optimalCost: numberSchema,
  purchaseDay: integerSchema(1),
});
export const inputSchema = objectSchema(
  {
    count: integerSchema(1, 128),
    minimumDays: integerSchema(0),
    maximumDays: integerSchema(0),
    distribution: { type: "string", enum: ["uniform", "censored-geometric"] },
    stopProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    rentalCost: positiveNumber,
    purchaseCost: positiveNumber,
    seed: generatorSeedSchema,
  },
  [
    "count",
    "minimumDays",
    "maximumDays",
    "distribution",
    "rentalCost",
    "purchaseCost",
  ],
);
export const outputSchema = objectSchema({
  trials: arraySchema(
    objectSchema({
      usageDays: integerSchema(0),
      result: resultSchema,
      ratio: numberSchema,
    }),
    128,
    1,
  ),
  meanOnlineCost: numberSchema,
  meanOptimalCost: numberSchema,
  worstObservedRatio: numberSchema,
  convention: { type: "string" },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is SkiRentalUsageExperimentInput =>
  matchesModelInput(input, inputSchema);
export const calculateSkiRentalUsageExperiment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SkiRentalUsageExperimentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    safeRange(input.minimumDays, input.maximumDays, "maximumDays");
    if (
      input.distribution === "censored-geometric" &&
      input.stopProbability === undefined
    )
      simpleError(
        "stopProbability",
        "A censored geometric distribution requires a stop probability.",
        "missing_stop_probability",
      );
    const purchaseDay = Math.ceil(input.purchaseCost / input.rentalCost);
    if (!Number.isSafeInteger(purchaseDay) || purchaseDay < 1)
      simpleError(
        "purchaseCost",
        "The core purchase day must be a positive safe integer.",
        "unrepresentable_purchase_day",
      );
    finite(
      Math.min(input.maximumDays, purchaseDay - 1) * input.rentalCost,
      "maximumDays",
    );
    if (input.maximumDays >= purchaseDay)
      finite(
        (purchaseDay - 1) * input.rentalCost + input.purchaseCost,
        "purchaseCost",
      );
    const random = createGeneratorRandom(input.seed, context);
    let meanOnlineCost = 0,
      meanOptimalCost = 0,
      worstObservedRatio = 1;
    const trials = Array.from({ length: input.count }, (_, i) => {
      let usageDays: number;
      if (input.distribution === "uniform")
        usageDays = random.integer(input.minimumDays, input.maximumDays);
      else {
        const u = random.unit(),
          p = input.stopProbability;
        if (p === undefined)
          throw new Error("Validated geometric probability disappeared.");
        const failures =
          p === 1 ? 0 : Math.floor(Math.log1p(-u) / Math.log1p(-p));
        usageDays =
          input.minimumDays +
          Math.min(input.maximumDays - input.minimumDays, failures);
      }
      const result = demonstrateSkiRental(
        input.rentalCost,
        input.purchaseCost,
        usageDays,
      );
      finite(result.onlineCost, "purchaseCost");
      finite(result.optimalCost, "rentalCost");
      finite(result.competitiveRatio, "rentalCost");
      const ratio =
        result.optimalCost === 0
          ? 1
          : finite(result.onlineCost / result.optimalCost, "rentalCost");
      meanOnlineCost += (result.onlineCost - meanOnlineCost) / (i + 1);
      meanOptimalCost += (result.optimalCost - meanOptimalCost) / (i + 1);
      worstObservedRatio = Math.max(worstObservedRatio, ratio);
      return { usageDays, result, ratio };
    });
    return toolSuccess({
      trials,
      meanOnlineCost: finite(meanOnlineCost, "count"),
      meanOptimalCost: finite(meanOptimalCost, "count"),
      worstObservedRatio,
      convention:
        "Buy on ceil(purchaseCost/rentalCost), after renting on earlier usage days. Geometric failures are shifted by minimumDays and censored at maximumDays. Core ratios inherit 12-significant-digit rounding; ratio is unrounded. Observed maxima are not global competitive guarantees.",
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const skiRentalUsageExperimentExample = {
  input: {
    count: 4,
    minimumDays: 0,
    maximumDays: 6,
    distribution: "uniform",
    rentalCost: 10,
    purchaseCost: 40,
    seed: 42,
  },
  output: {
    trials: [
      {
        usageDays: 4,
        result: {
          competitiveRatio: 1.75,
          decision: "buy on day 4",
          onlineCost: 70,
          optimalCost: 40,
          purchaseDay: 4,
        },
        ratio: 1.75,
      },
      {
        usageDays: 3,
        result: {
          competitiveRatio: 1,
          decision: "rent",
          onlineCost: 30,
          optimalCost: 30,
          purchaseDay: 4,
        },
        ratio: 1,
      },
      {
        usageDays: 5,
        result: {
          competitiveRatio: 1.75,
          decision: "buy on day 4",
          onlineCost: 70,
          optimalCost: 40,
          purchaseDay: 4,
        },
        ratio: 1.75,
      },
      {
        usageDays: 4,
        result: {
          competitiveRatio: 1.75,
          decision: "buy on day 4",
          onlineCost: 70,
          optimalCost: 40,
          purchaseDay: 4,
        },
        ratio: 1.75,
      },
    ],
    meanOnlineCost: 60,
    meanOptimalCost: 37.5,
    worstObservedRatio: 1.75,
    convention:
      "Buy on ceil(purchaseCost/rentalCost), after renting on earlier usage days. Geometric failures are shifted by minimumDays and censored at maximumDays. Core ratios inherit 12-significant-digit rounding; ratio is unrounded. Observed maxima are not global competitive guarantees.",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SkiRentalUsageExperimentInput,
  SkiRentalUsageExperimentOutput
>;
export const skiRentalUsageExperimentTool = createModelDefinition<
  SkiRentalUsageExperimentInput,
  SkiRentalUsageExperimentOutput
>({
  id: "random/ski-rental-usage-experiment",
  title: "Random Ski Rental Usage Experiment Generator",
  description:
    "Generate bounded uniform or censored-geometric usage horizons and delegate online-versus-hindsight ski-rental costs with empirical summaries.",
  inputSchema,
  outputSchema,
  execute: calculateSkiRentalUsageExperiment,
});
export const runSkiRentalUsageExperiment = skiRentalUsageExperimentTool.execute;
export default skiRentalUsageExperimentTool;
