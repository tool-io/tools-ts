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
  readonly rules: readonly {
    readonly label: string;
    readonly severity: string;
    readonly counterAllowed: boolean;
  }[];
  readonly maximumCounter: number;
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly badges: readonly {
    readonly label: string;
    readonly preview: string;
    readonly severity: string;
    readonly counter: number | null;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    rules: list(object({ label, severity: label, counterAllowed: bool })),
    maximumCounter: integer(),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["rules", "maximumCounter", "count"],
);
export const outputSchema = object({
  badges: list(
    object({
      label,
      preview: text,
      severity: label,
      counter: nullable(integer()),
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateBadgeStatusCombinationFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      input.maximumCounter === Number.MAX_SAFE_INTEGER &&
      input.rules.some((r) => r.counterAllowed)
    )
      return simpleError(
        "maximumCounter",
        "The inclusive counter range must fit the integer sampler.",
        "unsafe_sampling_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      badges = Array.from({ length: input.count }, () => {
        const rule = choose(input.rules, random);
        return {
          label: rule.label,
          preview: preview(rule.label, 24),
          severity: rule.severity,
          counter: rule.counterAllowed
            ? random.integer(0, input.maximumCounter)
            : null,
        };
      });
    return toolSuccess(
      finish({ badges, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const badgeStatusCombinationFixtureExample = {
  input: {
    rules: [
      { label: "Ready", severity: "success", counterAllowed: false },
      { label: "Pending", severity: "warning", counterAllowed: true },
    ],
    maximumCounter: 4,
    count: 2,
    seed: 42,
  },
  output: {
    badges: [
      { label: "Pending", preview: "Pending", severity: "warning", counter: 2 },
      { label: "Pending", preview: "Pending", severity: "warning", counter: 3 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const badgeStatusCombinationFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/badge-status-combination-fixture",
  title: "Random Badge Status Combination Fixture Generator",
  description:
    "Generate badge combinations only from supplied allowed label/severity/counter rules, retaining full labels and bounded optional counters.",
  inputSchema,
  outputSchema,
  execute: calculateBadgeStatusCombinationFixture,
});
export const runBadgeStatusCombinationFixture =
  badgeStatusCombinationFixtureTool.execute;
export default badgeStatusCombinationFixtureTool;
