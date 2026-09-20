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
  evaluateMathExpression,
  parseMathExpression,
  validateMathVariable,
  type MathNode,
} from "../../math/expression-evaluator/parser.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";

export type MonteCarloIntegrationInput = {
  readonly expression: string;
  readonly variable?: string;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly count: number;
  readonly seed?: number;
};
export type MonteCarloIntegrationOutput = {
  readonly abscissas: readonly number[];
  readonly values: readonly number[];
  readonly estimate: number;
  readonly standardError: number;
  readonly sampleCount: number;
  readonly randomness: GeneratorReplay;
};
const samplesSchema = {
  items: { type: "number" },
  minItems: 2,
  maxItems: 4096,
  type: "array",
} as const;
export const inputSchema = {
  additionalProperties: false,
  properties: {
    expression: {
      description:
        "Finite real expression supported by the existing scientific parser; explicit multiplication, trigonometry in radians, log base 10, ln natural log.",
      minLength: 1,
      maxLength: 1024,
      type: "string",
    },
    variable: { default: "x", minLength: 1, maxLength: 64, type: "string" },
    lowerBound: { type: "number" },
    upperBound: { type: "number" },
    count: { minimum: 2, maximum: 4096, type: "integer" },
    seed: generatorSeedSchema,
  },
  required: ["expression", "lowerBound", "upperBound", "count"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    abscissas: samplesSchema,
    values: samplesSchema,
    estimate: { type: "number" },
    standardError: {
      description:
        "Empirical standard error under the independent uniform-sampling finite-variance model; not a certified error bound.",
      minimum: 0,
      type: "number",
    },
    sampleCount: { minimum: 2, maximum: 4096, type: "integer" },
    randomness: generatorReplaySchema,
  },
  required: [
    "abscissas",
    "values",
    "estimate",
    "standardError",
    "sampleCount",
    "randomness",
  ],
  type: "object",
} as const;
const isInput = (input: unknown): input is MonteCarloIntegrationInput =>
  matchesModelInput(input, inputSchema);
export const calculateMonteCarloIntegration = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MonteCarloIntegrationOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const variable = validateMathVariable(input.variable ?? "x");
    const tree = parseMathExpression(input.expression, true);
    const pending: { node: MathNode; depth: number }[] = [
      { node: tree, depth: 1 },
    ];
    let nodes = 0;
    while (pending.length > 0) {
      const frame = pending.pop();
      if (!frame) break;
      nodes += 1;
      if (frame.depth > 64 || nodes * input.count > 200_000)
        simpleError(
          "expression",
          "Expression depth and sample-count × AST-node work exceed the bounded simulation budget.",
          "resource_limit_exceeded",
        );
      const node = frame.node;
      const children =
        node.kind === "binary"
          ? [node.left, node.right]
          : node.kind === "unary"
            ? [node.value]
            : node.kind === "call"
              ? node.arguments
              : [];
      children.forEach((child) =>
        pending.push({ node: child, depth: frame.depth + 1 }),
      );
    }
    const span = input.upperBound - input.lowerBound;
    if (!Number.isFinite(span))
      simpleError(
        "upperBound",
        "The signed interval width must be representable finitely.",
        "numeric_overflow",
      );
    // This is a regular finite-expression estimator, not an improper-integral solver.
    evaluateMathExpression(tree, { [variable]: input.lowerBound });
    evaluateMathExpression(tree, { [variable]: input.upperBound });
    const random = createGeneratorRandom(input.seed, context);
    const abscissas: number[] = [],
      values: number[] = [];
    let mean = 0,
      m2 = 0;
    for (let i = 0; i < input.count; i += 1) {
      const unit = random.unit();
      const x = input.lowerBound + span * unit;
      const value = evaluateMathExpression(tree, { [variable]: x });
      abscissas.push(x);
      values.push(value);
      const delta = value - mean;
      mean += delta / (i + 1);
      m2 += delta * (value - mean);
    }
    const estimate = span * mean,
      standardError =
        Math.abs(span) *
        Math.sqrt(Math.max(0, m2 / (input.count - 1)) / input.count);
    if (!Number.isFinite(estimate) || !Number.isFinite(standardError))
      simpleError(
        "expression",
        "The estimate or empirical variance cannot be represented finitely.",
        "numeric_overflow",
      );
    return toolSuccess({
      abscissas,
      values,
      estimate,
      standardError,
      sampleCount: input.count,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const monteCarloIntegrationExample = {
  input: {
    expression: "x^2",
    lowerBound: 0,
    upperBound: 1,
    count: 6,
    seed: 42,
  },
  output: {
    abscissas: [
      0.6011037519201636, 0.44829055899754167, 0.8524657934904099,
      0.6697340414393693, 0.17481389874592423, 0.5265925421845168,
    ],
    values: [
      0.3613257205724976, 0.20096442528632838, 0.7266979290712341,
      0.44854368626271085, 0.030559899194750252, 0.27729970548435207,
    ],
    estimate: 0.34089856097864557,
    standardError: 0.09674405339469955,
    sampleCount: 6,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  MonteCarloIntegrationInput,
  MonteCarloIntegrationOutput
>;
export const monteCarloIntegrationTool = createModelDefinition<
  MonteCarloIntegrationInput,
  MonteCarloIntegrationOutput
>({
  id: "random/monte-carlo-integration",
  title: "One-Dimensional Monte Carlo Integration Tool",
  description:
    "Estimate a regular finite real expression integral with uniform samples and an empirical standard error, retaining samples and seed metadata without claiming a certified bound or improper-integral support.",
  inputSchema,
  outputSchema,
  execute: calculateMonteCarloIntegration,
});
export const runMonteCarloIntegration = monteCarloIntegrationTool.execute;
export default monteCarloIntegrationTool;
