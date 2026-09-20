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
import { calculateRoundHalfToEven } from "../../arithmetic/round-half-to-even/tool.js";
import { runRoundToMultiple } from "../../arithmetic/round-to-multiple/tool.js";
import { runFloorToMultiple } from "../../arithmetic/floor-to-multiple/tool.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksInteger,
  mocksNumber,
  mocksBoolean,
  mocksOrdered,
  mocksFinite,
  mocksCore,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type DecimalRoundingBoundaryCorpusInput = {
  readonly count: number;
  readonly minimumAnchor: number;
  readonly maximumAnchor: number;
  readonly decimals: number;
  readonly multiple: number;
  readonly offsetFraction: number;
  readonly seed?: number;
};
export type RoundingNumber = {
  readonly value: number;
  readonly negativeZero: boolean;
};
export type DecimalRoundingBoundaryCorpusOutput = {
  readonly cases: readonly {
    readonly anchor: number;
    readonly relation: "below" | "tie" | "above";
    readonly value: RoundingNumber;
    readonly halfToEven: RoundingNumber;
    readonly nearestMultiple: RoundingNumber;
    readonly floorMultiple: RoundingNumber;
  }[];
  readonly randomness: GeneratorReplay;
};
const observedSchema = mocksObject({
  value: mocksNumber,
  negativeZero: mocksBoolean,
});
export const inputSchema = mocksObject(
  {
    count: { type: "integer", minimum: 1, maximum: 128 },
    minimumAnchor: mocksInteger,
    maximumAnchor: mocksInteger,
    decimals: { type: "integer", minimum: 0, maximum: 10 },
    multiple: mocksNumber,
    offsetFraction: {
      type: "number",
      exclusiveMinimum: 0,
      exclusiveMaximum: 0.5,
    },
    seed: generatorSeedSchema,
  },
  [
    "count",
    "minimumAnchor",
    "maximumAnchor",
    "decimals",
    "multiple",
    "offsetFraction",
  ],
);
export const outputSchema = mocksObject({
  cases: mocksArray(
    mocksObject({
      anchor: mocksInteger,
      relation: { type: "string", enum: ["below", "tie", "above"] },
      value: observedSchema,
      halfToEven: observedSchema,
      nearestMultiple: observedSchema,
      floorMultiple: observedSchema,
    }),
    384,
    3,
  ),
  randomness: generatorReplaySchema,
});
const observed = (value: number): RoundingNumber => ({
  value: Object.is(value, -0) ? 0 : value,
  negativeZero: Object.is(value, -0),
});
const generate = (
  input: DecimalRoundingBoundaryCorpusInput,
  random: GeneratorRandom,
): Omit<DecimalRoundingBoundaryCorpusOutput, "randomness"> => {
  mocksOrdered(input.minimumAnchor, input.maximumAnchor, "maximumAnchor");
  if (input.multiple === 0)
    simpleError("multiple", "Multiple must not be zero.", "zero_multiple");
  const factor = 10 ** input.decimals,
    cases: DecimalRoundingBoundaryCorpusOutput["cases"][number][] = [];
  for (let i = 0; i < input.count; i += 1) {
    const anchor = random.integer(input.minimumAnchor, input.maximumAnchor),
      tie = (anchor + 0.5) / factor,
      offset = input.offsetFraction / factor;
    if (
      anchor + 0.5 - anchor !== 0.5 ||
      !(tie - offset < tie && tie < tie + offset)
    )
      simpleError(
        "offsetFraction",
        "The tie neighborhood cannot be distinguished at this floating-point scale.",
        "unrepresentable_boundary",
      );
    for (const [relation, value] of [
      ["below", tie - offset],
      ["tie", tie],
      ["above", tie + offset],
    ] as const) {
      const half = mocksFinite(
        calculateRoundHalfToEven({ value, decimals: input.decimals }).rounded,
        "decimals",
      );
      const nearest = mocksCore(
        runRoundToMultiple({ value, multiple: input.multiple }),
        "multiple",
      ).result;
      const floor = mocksCore(
        runFloorToMultiple({ value, multiple: input.multiple }),
        "multiple",
      ).result;
      cases.push({
        anchor,
        relation,
        value: observed(value),
        halfToEven: observed(half),
        nearestMultiple: observed(nearest),
        floorMultiple: observed(floor),
      });
    }
  }
  return { cases };
};
export const decimalRoundingBoundaryCorpusExample = {
  input: {
    count: 1,
    minimumAnchor: -3,
    maximumAnchor: 3,
    decimals: 0,
    multiple: 2,
    offsetFraction: 0.25,
    seed: 42,
  },
  output: {
    cases: [
      {
        anchor: 1,
        relation: "below",
        value: { value: 1.25, negativeZero: false },
        halfToEven: { value: 1, negativeZero: false },
        nearestMultiple: { value: 2, negativeZero: false },
        floorMultiple: { value: 0, negativeZero: false },
      },
      {
        anchor: 1,
        relation: "tie",
        value: { value: 1.5, negativeZero: false },
        halfToEven: { value: 2, negativeZero: false },
        nearestMultiple: { value: 2, negativeZero: false },
        floorMultiple: { value: 0, negativeZero: false },
      },
      {
        anchor: 1,
        relation: "above",
        value: { value: 1.75, negativeZero: false },
        halfToEven: { value: 2, negativeZero: false },
        nearestMultiple: { value: 2, negativeZero: false },
        floorMultiple: { value: 0, negativeZero: false },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  DecimalRoundingBoundaryCorpusInput,
  DecimalRoundingBoundaryCorpusOutput
>;

const isInput = (input: unknown): input is DecimalRoundingBoundaryCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateDecimalRoundingBoundaryCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DecimalRoundingBoundaryCorpusOutput> => {
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
export const decimalRoundingBoundaryCorpusTool = createModelDefinition<
  DecimalRoundingBoundaryCorpusInput,
  DecimalRoundingBoundaryCorpusOutput
>({
  id: "random/decimal-rounding-boundary-corpus",
  title: "Random Decimal Rounding Boundary Corpus Generator",
  description:
    "Generate finite neighborhoods of decimal ties and report three rounding cores' full-precision outcomes with explicit negative-zero evidence.",
  inputSchema,
  outputSchema,
  execute: calculateDecimalRoundingBoundaryCorpus,
});
export const runDecimalRoundingBoundaryCorpus =
  decimalRoundingBoundaryCorpusTool.execute;
export default decimalRoundingBoundaryCorpusTool;
