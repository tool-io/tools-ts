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
import { calculateEncodeSqids } from "../../encode/sqids/tool.js";
import { calculateDecodeSqids } from "../../decode/sqids/tool.js";

export type SqidsReversibleIdFixtureInput = {
  readonly minimum: number;
  readonly maximum: number;
  readonly tupleLength: number;
  readonly count: number;
  readonly seed?: number;
};
export type SqidsReversibleIdFixtureOutput = {
  readonly fixtures: readonly {
    readonly numbers: readonly number[];
    readonly id: string;
    readonly decoded: readonly number[];
    readonly roundTripVerified: boolean;
  }[];
  readonly duplicatePairs: readonly (readonly [number, number])[];
  readonly randomness: GeneratorReplay;
};
const numbersSchema = {
  type: "array",
  minItems: 1,
  maxItems: 16,
  items: { type: "integer", minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimum: { type: "integer", minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
    maximum: { type: "integer", minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
    tupleLength: { type: "integer", minimum: 1, maximum: 16 },
    count: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: ["minimum", "maximum", "tupleLength", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixtures: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          numbers: numbersSchema,
          id: { type: "string", minLength: 1, maxLength: 1000 },
          decoded: numbersSchema,
          roundTripVerified: { type: "boolean" },
        },
        required: ["numbers", "id", "decoded", "roundTripVerified"],
      },
    },
    duplicatePairs: {
      type: "array",
      maxItems: 2016,
      items: {
        type: "array",
        minItems: 2,
        maxItems: 2,
        items: { type: "integer", minimum: 0, maximum: 63 },
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["fixtures", "duplicatePairs", "randomness"],
} as const;

const isInput = (input: unknown): input is SqidsReversibleIdFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateSqidsReversibleIdFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SqidsReversibleIdFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      input.minimum > input.maximum ||
      !Number.isSafeInteger(input.maximum - input.minimum + 1)
    )
      simpleError(
        "maximum",
        "The inclusive range must be ordered with safe integer cardinality.",
        "invalid_integer_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const fixtures = Array.from({ length: input.count }, () => {
      const numbers = Array.from({ length: input.tupleLength }, () =>
        random.integer(input.minimum, input.maximum),
      );
      const encoded = calculateEncodeSqids({ numbers });
      if (!encoded.ok)
        throw new Error("A generated nonnegative tuple was rejected.");
      const decoded = calculateDecodeSqids({ id: encoded.output.id });
      if (!decoded.ok)
        throw new Error("A generated Sqid failed default-alphabet decoding.");
      return {
        numbers,
        id: encoded.output.id,
        decoded: decoded.output.numbers,
        roundTripVerified:
          decoded.output.numbers.length === numbers.length &&
          decoded.output.numbers.every((value, i) => value === numbers[i]),
      };
    });
    const duplicatePairs: [number, number][] = [];
    for (let i = 0; i < fixtures.length; i += 1)
      for (let j = i + 1; j < fixtures.length; j += 1)
        if (fixtures[i].id === fixtures[j].id) duplicatePairs.push([i, j]);
    return toolSuccess({
      fixtures,
      duplicatePairs,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const sqidsReversibleIdFixtureExample = {
  input: {
    minimum: 0,
    maximum: 9,
    tupleLength: 3,
    count: 3,
    seed: 42,
  },
  output: {
    fixtures: [
      {
        numbers: [6, 4, 8],
        id: "YFEbTW",
        decoded: [6, 4, 8],
        roundTripVerified: true,
      },
      {
        numbers: [6, 1, 5],
        id: "WJ0jrU",
        decoded: [6, 1, 5],
        roundTripVerified: true,
      },
      {
        numbers: [2, 6, 8],
        id: "uh2MYQ",
        decoded: [2, 6, 8],
        roundTripVerified: true,
      },
    ],
    duplicatePairs: [],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  SqidsReversibleIdFixtureInput,
  SqidsReversibleIdFixtureOutput
>;
export const sqidsReversibleIdFixtureTool = createModelDefinition<
  SqidsReversibleIdFixtureInput,
  SqidsReversibleIdFixtureOutput
>({
  id: "random/sqids-reversible-id-fixture",
  title: "Random Sqids Reversible ID Fixture Generator",
  description:
    "Draw fixed-length tuples of nonnegative safe integers from an inclusive range, delegate standard-alphabet/blocklist Sqids encoding and decoding, and report round trips plus repeated tuples; this is reversible obfuscation, not encryption, uniqueness allocation or a custom-alphabet generator.",
  inputSchema,
  outputSchema,
  execute: calculateSqidsReversibleIdFixture,
});
export const runSqidsReversibleIdFixture = sqidsReversibleIdFixtureTool.execute;
export default sqidsReversibleIdFixtureTool;
