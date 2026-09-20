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
import { calculateCubicHermite } from "../../interpolation/cubic-hermite/tool.js";
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

export type HermiteIntegerRange = {
  readonly minimum: number;
  readonly maximum: number;
};
export type CubicHermiteCurveBankInput = {
  readonly count: number;
  readonly samplesPerCurve: number;
  readonly p0Range: HermiteIntegerRange;
  readonly p1Range: HermiteIntegerRange;
  readonly m0Range: HermiteIntegerRange;
  readonly m1Range: HermiteIntegerRange;
  readonly seed?: number;
};
export type CubicHermiteCurveBankOutput = {
  readonly curves: readonly {
    readonly p0: number;
    readonly p1: number;
    readonly m0: number;
    readonly m1: number;
    readonly samples: readonly {
      readonly t: number;
      readonly value: number;
      readonly coreValue: number;
    }[];
  }[];
  readonly tangentConvention: string;
  readonly corePrecision: string;
  readonly randomness: GeneratorReplay;
};
const rangeSchema = objectSchema({
  minimum: { type: "integer" },
  maximum: { type: "integer" },
});
export const inputSchema = objectSchema(
  {
    count: integerSchema(1, 32),
    samplesPerCurve: integerSchema(2, 65),
    p0Range: rangeSchema,
    p1Range: rangeSchema,
    m0Range: rangeSchema,
    m1Range: rangeSchema,
    seed: generatorSeedSchema,
  },
  ["count", "samplesPerCurve", "p0Range", "p1Range", "m0Range", "m1Range"],
);
export const outputSchema = objectSchema({
  curves: arraySchema(
    objectSchema({
      p0: numberSchema,
      p1: numberSchema,
      m0: numberSchema,
      m1: numberSchema,
      samples: arraySchema(
        objectSchema({
          t: { type: "number", minimum: 0, maximum: 1 },
          value: numberSchema,
          coreValue: numberSchema,
        }),
        65,
        2,
      ),
    }),
    32,
    1,
  ),
  tangentConvention: { type: "string" },
  corePrecision: { type: "string" },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CubicHermiteCurveBankInput =>
  matchesModelInput(input, inputSchema);
export const calculateCubicHermiteCurveBank = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CubicHermiteCurveBankOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.count * input.samplesPerCurve > 1024)
      simpleError(
        "samplesPerCurve",
        "Retain at most 1,024 curve samples.",
        "resource_limit",
      );
    for (const [field, range] of [
      ["p0Range", input.p0Range],
      ["p1Range", input.p1Range],
      ["m0Range", input.m0Range],
      ["m1Range", input.m1Range],
    ] as const)
      safeRange(range.minimum, range.maximum, field);
    const random = createGeneratorRandom(input.seed, context);
    const draw = (range: HermiteIntegerRange) =>
      random.integer(range.minimum, range.maximum);
    const curves = Array.from({ length: input.count }, () => {
      const p0 = draw(input.p0Range),
        p1 = draw(input.p1Range),
        m0 = draw(input.m0Range),
        m1 = draw(input.m1Range);
      const samples = Array.from({ length: input.samplesPerCurve }, (_, i) => {
        const t = i / (input.samplesPerCurve - 1),
          t2 = t * t,
          t3 = t2 * t;
        const value = finite(
          (2 * t3 - 3 * t2 + 1) * p0 +
            (t3 - 2 * t2 + t) * m0 +
            (-2 * t3 + 3 * t2) * p1 +
            (t3 - t2) * m1,
          "m0Range",
        );
        const coreValue = finite(
          calculateCubicHermite({ p0, p1, m0, m1, t }).value,
          "m0Range",
        );
        return { t, value, coreValue };
      });
      return { p0, p1, m0, m1, samples };
    });
    return toolSuccess({
      curves,
      tangentConvention:
        "Tangents are derivatives with respect to normalized t in [0,1]; curves may overshoot and need not be monotone.",
      corePrecision:
        "coreValue inherits 12-significant-digit rounding; value preserves unrounded basis arithmetic.",
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cubicHermiteCurveBankExample = {
  input: {
    count: 2,
    samplesPerCurve: 3,
    p0Range: { minimum: 0, maximum: 4 },
    p1Range: { minimum: 6, maximum: 10 },
    m0Range: { minimum: -4, maximum: 4 },
    m1Range: { minimum: -2, maximum: 2 },
    seed: 42,
  },
  output: {
    curves: [
      {
        p0: 3,
        p1: 8,
        m0: 3,
        m1: 1,
        samples: [
          { t: 0, value: 3, coreValue: 3 },
          { t: 0.5, value: 5.75, coreValue: 5.75 },
          { t: 1, value: 8, coreValue: 8 },
        ],
      },
      {
        p0: 0,
        p1: 8,
        m0: -2,
        m1: 1,
        samples: [
          { t: 0, value: 0, coreValue: 0 },
          { t: 0.5, value: 3.625, coreValue: 3.625 },
          { t: 1, value: 8, coreValue: 8 },
        ],
      },
    ],
    tangentConvention:
      "Tangents are derivatives with respect to normalized t in [0,1]; curves may overshoot and need not be monotone.",
    corePrecision:
      "coreValue inherits 12-significant-digit rounding; value preserves unrounded basis arithmetic.",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CubicHermiteCurveBankInput,
  CubicHermiteCurveBankOutput
>;
export const cubicHermiteCurveBankTool = createModelDefinition<
  CubicHermiteCurveBankInput,
  CubicHermiteCurveBankOutput
>({
  id: "random/cubic-hermite-curve-bank",
  title: "Random Cubic Hermite Curve Bank Generator",
  description:
    "Draw independent integer endpoint and tangent tuples and sample bounded Hermite curves, retaining unrounded values alongside delegated core values.",
  inputSchema,
  outputSchema,
  execute: calculateCubicHermiteCurveBank,
});
export const runCubicHermiteCurveBank = cubicHermiteCurveBankTool.execute;
export default cubicHermiteCurveBankTool;
