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

export type ScientificPrefixMatchingQuizInput = {
  readonly mappings: readonly {
    readonly prefix: string;
    readonly symbol: string;
    readonly exponent: number;
  }[];
  readonly unit: string;
  readonly provenance: string;
  readonly seed?: number;
};
export type ScientificPrefixMatchingQuizOutput = {
  readonly cards: readonly {
    readonly prefix: string;
    readonly symbol: string;
    readonly exponent: number;
  }[];
  readonly displayedExponents: readonly number[];
  readonly unit: string;
  readonly provenance: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    mappings: array(
      object({
        prefix: label,
        symbol: label,
        exponent: { type: "integer", minimum: -300, maximum: 300 },
      }),
      16,
      2,
    ),
    unit: label,
    provenance: label,
    seed: generatorSeedSchema,
  },
  ["mappings", "unit", "provenance"],
);
export const outputSchema = object({
  cards: array(
    object({ prefix: label, symbol: label, exponent: integer }),
    16,
    2,
  ),
  displayedExponents: array(integer, 16, 2),
  unit: label,
  provenance: label,
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is ScientificPrefixMatchingQuizInput =>
  matchesModelInput(value, inputSchema);
export const calculateScientificPrefixMatchingQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ScientificPrefixMatchingQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(
      input.mappings.map((m) => m.prefix),
      "mappings",
    );
    distinct(
      input.mappings.map((m) => m.symbol),
      "mappings",
    );
    distinct(
      input.mappings.map((m) => m.exponent),
      "mappings",
    );
    const cards = random.shuffle(input.mappings).map((m) => ({ ...m })),
      displayedExponents = random.shuffle(
        input.mappings.map((m) => m.exponent),
      );
    const result = {
      cards,
      displayedExponents,
      unit: input.unit,
      provenance: input.provenance,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const scientificPrefixMatchingQuizExample = {
  input: {
    mappings: [
      { prefix: "kilo", symbol: "k", exponent: 3 },
      { prefix: "milli", symbol: "m", exponent: -3 },
    ],
    unit: "m",
    provenance: "https://www.bipm.org/en/measurement-units/si-prefixes",
    seed: 42,
  },
  output: {
    cards: [
      { prefix: "kilo", symbol: "k", exponent: 3 },
      { prefix: "milli", symbol: "m", exponent: -3 },
    ],
    displayedExponents: [-3, 3],
    unit: "m",
    provenance: "https://www.bipm.org/en/measurement-units/si-prefixes",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ScientificPrefixMatchingQuizInput,
  ScientificPrefixMatchingQuizOutput
>;
export const scientificPrefixMatchingQuizTool = createModelDefinition<
  ScientificPrefixMatchingQuizInput,
  ScientificPrefixMatchingQuizOutput
>({
  id: "random/scientific-prefix-matching-quiz",
  title: "Random Scientific Prefix Matching Quiz Generator",
  description:
    "Shuffle caller-reviewed prefix and exponent matching cards while retaining unit and provenance; no built-in prefix facts are invented.",
  inputSchema,
  outputSchema,
  execute: calculateScientificPrefixMatchingQuiz,
});
export const runScientificPrefixMatchingQuiz =
  scientificPrefixMatchingQuizTool.execute;
export default scientificPrefixMatchingQuizTool;
