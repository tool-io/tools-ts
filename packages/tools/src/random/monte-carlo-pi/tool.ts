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
import { calculateDistance } from "../../geometry/distance/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";

export type MonteCarloPiInput = {
  readonly count: number;
  readonly seed?: number;
};
export type MonteCarloPiOutput = {
  readonly sampleCount: number;
  readonly points: readonly (readonly [number, number])[];
  readonly insideCircle: readonly boolean[];
  readonly insideCount: number;
  readonly estimate: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    count: { minimum: 1, maximum: 4096, type: "integer" },
    seed: generatorSeedSchema,
  },
  required: ["count"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    sampleCount: { minimum: 1, maximum: 4096, type: "integer" },
    points: {
      items: {
        items: { minimum: 0, exclusiveMaximum: 1, type: "number" },
        minItems: 2,
        maxItems: 2,
        type: "array",
      },
      minItems: 1,
      maxItems: 4096,
      type: "array",
    },
    insideCircle: {
      items: { type: "boolean" },
      minItems: 1,
      maxItems: 4096,
      type: "array",
    },
    insideCount: { minimum: 0, maximum: 4096, type: "integer" },
    estimate: { minimum: 0, maximum: 4, type: "number" },
    randomness: generatorReplaySchema,
  },
  required: [
    "sampleCount",
    "points",
    "insideCircle",
    "insideCount",
    "estimate",
    "randomness",
  ],
  type: "object",
} as const;
const isInput = (input: unknown): input is MonteCarloPiInput =>
  matchesModelInput(input, inputSchema);
export const calculateMonteCarloPi = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MonteCarloPiOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const points: [number, number][] = [],
      insideCircle: boolean[] = [];
    let insideCount = 0;
    for (let i = 0; i < input.count; i += 1) {
      const x = random.unit(),
        y = random.unit();
      const radius = calculateDistance({
        mode: "2d-euclidean",
        point1A: 0,
        point1B: 0,
        point2A: x,
        point2B: y,
      });
      if (radius === null)
        throw new Error(
          "A validated unit-square point had no Euclidean distance.",
        );
      const inside = radius <= 1;
      points.push([x, y]);
      insideCircle.push(inside);
      if (inside) insideCount += 1;
    }
    return toolSuccess({
      sampleCount: input.count,
      points,
      insideCircle,
      insideCount,
      estimate: (4 * insideCount) / input.count,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const monteCarloPiExample = {
  input: {
    count: 6,
    seed: 42,
  },
  output: {
    sampleCount: 6,
    points: [
      [0.6011037519201636, 0.44829055899754167],
      [0.8524657934904099, 0.6697340414393693],
      [0.17481389874592423, 0.5265925421845168],
      [0.2732279943302274, 0.6247446539346129],
      [0.8654746483080089, 0.4723170551005751],
      [0.24992373422719538, 0.8820588334929198],
    ],
    insideCircle: [true, false, true, true, true, true],
    insideCount: 5,
    estimate: 3.3333333333333335,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<MonteCarloPiInput, MonteCarloPiOutput>;
export const monteCarloPiTool = createModelDefinition<
  MonteCarloPiInput,
  MonteCarloPiOutput
>({
  id: "random/monte-carlo-pi",
  title: "Monte Carlo Pi Estimator",
  description:
    "Draw bounded uniform unit-square points, classify the inclusive quarter-circle boundary through the distance tool, and estimate pi as four times the observed fraction, without an accuracy guarantee.",
  inputSchema,
  outputSchema,
  execute: calculateMonteCarloPi,
});
export const runMonteCarloPi = monteCarloPiTool.execute;
export default monteCarloPiTool;
