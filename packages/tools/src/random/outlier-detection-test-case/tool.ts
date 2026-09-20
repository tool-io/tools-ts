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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  drawSyntheticNormal,
  normalizeGeneratedSample,
} from "../synthetic-normal-construction.js";
import { runOutlierCountIqr } from "../../statistics/outlier-count-iqr/tool.js";

export type OutlierDetectionTestCaseInput = {
  readonly baselineCount: number;
  readonly baselineMean: number;
  readonly baselineStandardDeviation: number;
  readonly contaminationCount: number;
  readonly contaminationOffset: number;
  readonly contaminationSide: "upper" | "lower" | "both";
  readonly seed?: number;
};
export type OutlierDetectionTestCaseOutput = {
  readonly values: readonly number[];
  readonly injected: readonly boolean[];
  readonly injectedCount: number;
  readonly detectedCount: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineCount: { type: "integer", minimum: 4, maximum: 1024 },
    baselineMean: { type: "number" },
    baselineStandardDeviation: { type: "number", minimum: 0 },
    contaminationCount: { type: "integer", minimum: 0, maximum: 128 },
    contaminationOffset: { type: "number", minimum: 0 },
    contaminationSide: { type: "string", enum: ["upper", "lower", "both"] },
    seed: generatorSeedSchema,
  },
  required: [
    "baselineCount",
    "baselineMean",
    "baselineStandardDeviation",
    "contaminationCount",
    "contaminationOffset",
    "contaminationSide",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      minItems: 4,
      maxItems: 1152,
      items: { type: "number" },
    },
    injected: {
      type: "array",
      minItems: 4,
      maxItems: 1152,
      items: { type: "boolean" },
    },
    injectedCount: { type: "integer", minimum: 0, maximum: 128 },
    detectedCount: { type: "integer", minimum: 0, maximum: 1152 },
    randomness: generatorReplaySchema,
  },
  required: [
    "values",
    "injected",
    "injectedCount",
    "detectedCount",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is OutlierDetectionTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateOutlierDetectionTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<OutlierDetectionTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const rows = Array.from({ length: input.baselineCount }, () => ({
      value: drawSyntheticNormal(
        input.baselineMean,
        input.baselineStandardDeviation,
        random,
        "baselineStandardDeviation",
      ),
      injected: false,
    }));
    for (let i = 0; i < input.contaminationCount; i += 1) {
      const sign =
        input.contaminationSide === "upper"
          ? 1
          : input.contaminationSide === "lower"
            ? -1
            : random.unit() < 0.5
              ? -1
              : 1;
      const value = input.baselineMean + sign * input.contaminationOffset;
      if (!Number.isFinite(value))
        simpleError(
          "contaminationOffset",
          "Contaminated values must remain finite.",
          "numeric_overflow",
        );
      rows.push({ value: value === 0 ? 0 : value, injected: true });
    }
    const shuffled = random.shuffle(rows),
      values = shuffled.map((row) => row.value),
      injected = shuffled.map((row) => row.injected);
    const normalized = normalizeGeneratedSample(values),
      detector = runOutlierCountIqr({ values: normalized.values });
    if (!detector.ok)
      throw new Error(
        "A bounded finite normalized sample was rejected by the IQR counter.",
      );
    return toolSuccess({
      values,
      injected,
      injectedCount: input.contaminationCount,
      detectedCount: detector.output.count,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const outlierDetectionTestCaseExample = {
  input: {
    baselineCount: 8,
    baselineMean: 100,
    baselineStandardDeviation: 5,
    contaminationCount: 2,
    contaminationOffset: 40,
    contaminationSide: "both",
    seed: 42,
  },
  output: {
    values: [
      106.14295336531552, 90.79186407608202, 140, 98.63486947558695,
      90.99103291156455, 94.29558964522988, 140, 98.65741136686378,
      97.35283103141792, 95.21918885307926,
    ],
    injected: [
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
    ],
    injectedCount: 2,
    detectedCount: 2,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  OutlierDetectionTestCaseInput,
  OutlierDetectionTestCaseOutput
>;
export const outlierDetectionTestCaseTool = createModelDefinition<
  OutlierDetectionTestCaseInput,
  OutlierDetectionTestCaseOutput
>({
  id: "random/outlier-detection-test-case",
  title: "Random Outlier Detection Test Case Generator",
  description:
    "Generate a Gaussian baseline plus explicitly labeled fixed-offset contamination, shuffle retained labels and delegate Tukey-IQR outlier counting after safe positive-affine normalization; injected labels are not detector truth and quartiles follow the inherited median-of-halves convention.",
  inputSchema,
  outputSchema,
  execute: calculateOutlierDetectionTestCase,
});
export const runOutlierDetectionTestCase = outlierDetectionTestCaseTool.execute;
export default outlierDetectionTestCaseTool;
