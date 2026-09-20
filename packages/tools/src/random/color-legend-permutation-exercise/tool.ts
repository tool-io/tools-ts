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

export type ColorLegendPermutationExerciseInput = {
  readonly mappings: readonly {
    readonly id: string;
    readonly color: string;
    readonly value: number;
  }[];
  readonly seed?: number;
};
export type ColorLegendPermutationExerciseOutput = {
  readonly displayed: readonly {
    readonly id: string;
    readonly color: string;
    readonly value: number;
  }[];
  readonly originalIndices: readonly number[];
  readonly correct: readonly {
    readonly id: string;
    readonly color: string;
    readonly value: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    mappings: array(object({ id: label, color: label, value: number }), 32, 2),
    seed: generatorSeedSchema,
  },
  ["mappings"],
);
export const outputSchema = object({
  displayed: array(object({ id: label, color: label, value: number }), 32, 2),
  originalIndices: array(integer, 32, 2),
  correct: array(object({ id: label, color: label, value: number }), 32, 2),
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is ColorLegendPermutationExerciseInput =>
  matchesModelInput(value, inputSchema);
export const calculateColorLegendPermutationExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ColorLegendPermutationExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(
      input.mappings.map((m) => m.id),
      "mappings",
    );
    distinct(
      input.mappings.map((m) => m.color),
      "mappings",
    );
    const originalIndices = random.shuffle(input.mappings.map((_, i) => i)),
      copy = (m: (typeof input.mappings)[number]) => ({
        id: m.id,
        color: m.color,
        value: finite(m.value),
      });
    const result = {
      displayed: originalIndices.map((i) => copy(input.mappings[i])),
      originalIndices,
      correct: input.mappings.map(copy),
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const colorLegendPermutationExerciseExample = {
  input: {
    mappings: [
      { id: "a", color: "red", value: 2 },
      { id: "b", color: "blue", value: 5 },
      { id: "c", color: "green", value: 8 },
    ],
    seed: 42,
  },
  output: {
    displayed: [
      { id: "c", color: "green", value: 8 },
      { id: "a", color: "red", value: 2 },
      { id: "b", color: "blue", value: 5 },
    ],
    originalIndices: [2, 0, 1],
    correct: [
      { id: "a", color: "red", value: 2 },
      { id: "b", color: "blue", value: 5 },
      { id: "c", color: "green", value: 8 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ColorLegendPermutationExerciseInput,
  ColorLegendPermutationExerciseOutput
>;
export const colorLegendPermutationExerciseTool = createModelDefinition<
  ColorLegendPermutationExerciseInput,
  ColorLegendPermutationExerciseOutput
>({
  id: "random/color-legend-permutation-exercise",
  title: "Random Color Legend Permutation Exercise Generator",
  description:
    "Shuffle supplied color/value legend mappings while retaining their exact correct associations and original indices; color accessibility is separately assessed.",
  inputSchema,
  outputSchema,
  execute: calculateColorLegendPermutationExercise,
});
export const runColorLegendPermutationExercise =
  colorLegendPermutationExerciseTool.execute;
export default colorLegendPermutationExerciseTool;
