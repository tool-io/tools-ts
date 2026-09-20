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
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  bounded,
  boolean,
  choice,
  scalar,
  type Scalar,
} from "../m500b-web-json-schema.js";
import { pick, pretty } from "../m500b-web-json-json.js";
export type JsonNumberPrecisionCorpusInput = {
  readonly numbers: readonly number[];
  readonly integerStrings: readonly string[];
  readonly kinds: readonly ("number" | "integer-string")[];
  readonly count: number;
  readonly seed?: number;
};
export type JsonNumberPrecisionCorpusOutput = {
  readonly cases: readonly {
    readonly kind: string;
    readonly value: number | string;
    readonly json: string;
    readonly pretty: string;
    readonly roundTripExact: boolean;
    readonly safeAsInteger: boolean;
    readonly numericProjection: number;
    readonly projectionExact: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    numbers: array({ type: "number" }, 16, 1),
    integerStrings: array(
      { type: "string", maxLength: 128, minLength: 1 },
      16,
      1,
    ),
    kinds: array(choice(["number", "integer-string"]), 2, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["numbers", "integerStrings", "kinds", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      kind: text,
      value: { anyOf: [{ type: "number" }, text] },
      json: text,
      pretty: text,
      roundTripExact: boolean,
      safeAsInteger: boolean,
      numericProjection: { type: "number" },
      projectionExact: boolean,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is JsonNumberPrecisionCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonNumberPrecisionCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonNumberPrecisionCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (
      input.integerStrings.some(
        (s) => !/^[-]?(?:0|[1-9][0-9]*)(?![\s\S])/u.test(s),
      )
    )
      simpleError(
        "integerStrings",
        "Use canonical decimal integer text without leading zeros.",
        "invalid_integer_text",
      );
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const kind = pick(input.kinds, random),
          selected =
            kind === "number"
              ? pick(input.numbers, random)
              : pick(input.integerStrings, random),
          value = selected === 0 ? 0 : selected,
          json = JSON.stringify(value),
          parsed: unknown = JSON.parse(json),
          projected = typeof value === "number" ? value : Number(value),
          numericProjection = projected === 0 ? 0 : projected;
        if (!Number.isFinite(numericProjection))
          throw new Error("Bounded decimal string overflowed");
        const safeAsInteger =
            typeof value === "number"
              ? Number.isSafeInteger(value)
              : BigInt(value) >= BigInt(Number.MIN_SAFE_INTEGER) &&
                BigInt(value) <= BigInt(Number.MAX_SAFE_INTEGER),
          projectionExact =
            typeof value === "number" ||
            BigInt(numericProjection) === BigInt(value);
        return {
          kind,
          value,
          json,
          pretty: pretty(value),
          roundTripExact: parsed === value,
          safeAsInteger,
          numericProjection,
          projectionExact,
        };
      });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonNumberPrecisionCorpusExample = {
  input: {
    numbers: [0.125],
    integerStrings: ["9007199254740993"],
    kinds: ["integer-string"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        kind: "integer-string",
        value: "9007199254740993",
        json: '"9007199254740993"',
        pretty: '"9007199254740993"\n',
        roundTripExact: true,
        safeAsInteger: false,
        numericProjection: 9007199254740992,
        projectionExact: false,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonNumberPrecisionCorpusInput,
  JsonNumberPrecisionCorpusOutput
>;
export const jsonNumberPrecisionCorpusTool = createModelDefinition<
  JsonNumberPrecisionCorpusInput,
  JsonNumberPrecisionCorpusOutput
>({
  id: "random/json-number-precision-corpus",
  title: "Random JSON Number Precision Corpus Generator",
  description:
    "Construct finite-number and decimal-integer-string round trips while retaining safe-integer and exact versus lossy numeric projection labels.",
  inputSchema,
  outputSchema,
  execute: calculateJsonNumberPrecisionCorpus,
});
export const runJsonNumberPrecisionCorpus =
  jsonNumberPrecisionCorpusTool.execute;
export default jsonNumberPrecisionCorpusTool;
