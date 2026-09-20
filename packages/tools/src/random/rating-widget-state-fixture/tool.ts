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
  text,
  label,
  id,
  bool,
  number,
  integer,
  list,
  object,
  enumeration,
  nullable,
  markup,
  parsedSchema,
  choose,
  preview,
  distinct,
  work,
  finite,
  escape,
  parse,
  finish,
} from "../m500b-ui-accessibility-support.js";

export type Input = {
  readonly labels: readonly string[];
  readonly maximum: number;
  readonly subdivisions: number;
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly states: readonly {
    readonly label: string;
    readonly value: number;
    readonly whole: number;
    readonly fraction: number;
    readonly disabled: boolean;
    readonly fills: readonly number[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    labels: list(label),
    maximum: integer(1, 32),
    subdivisions: integer(1, 32),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["labels", "maximum", "subdivisions", "count"],
);
export const outputSchema = object({
  states: list(
    object({
      label,
      value: { type: "number", minimum: 0, maximum: 32 },
      whole: integer(0, 32),
      fraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      disabled: bool,
      fills: list({ type: "number", minimum: 0, maximum: 1 }),
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateRatingWidgetStateFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    work(input.maximum, input.subdivisions, "subdivisions");
    work(input.count, input.maximum, "count");
    const random = createGeneratorRandom(input.seed, context),
      states = Array.from({ length: input.count }, () => {
        const ticks = random.integer(0, input.maximum * input.subdivisions),
          value = ticks / input.subdivisions,
          disabled = random.unit() < 0.5,
          label = preview(choose(input.labels, random), 128),
          whole = Math.floor(value),
          fraction = (ticks % input.subdivisions) / input.subdivisions;
        return {
          label,
          value,
          whole,
          fraction,
          disabled,
          fills: Array.from({ length: input.maximum }, (_, i) =>
            Math.max(
              0,
              Math.min(
                1,
                (ticks - i * input.subdivisions) / input.subdivisions,
              ),
            ),
          ),
        };
      });
    return toolSuccess(
      finish({ states, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const ratingWidgetStateFixtureExample = {
  input: {
    labels: ["Quality", "Comfort"],
    maximum: 3,
    subdivisions: 2,
    count: 1,
    seed: 42,
  },
  output: {
    states: [
      {
        label: "Comfort",
        value: 2,
        whole: 2,
        fraction: 0,
        disabled: true,
        fills: [1, 1, 0],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const ratingWidgetStateFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/rating-widget-state-fixture",
  title: "Random Rating Widget State Fixture Generator",
  description:
    "Draw bounded integer rating ticks under a supplied maximum and subdivision contract, retaining fractional fills and disabled states with caller labels.",
  inputSchema,
  outputSchema,
  execute: calculateRatingWidgetStateFixture,
});
export const runRatingWidgetStateFixture = ratingWidgetStateFixtureTool.execute;
export default ratingWidgetStateFixtureTool;
