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
import { calculateCookieSerializer } from "../../http/cookie-serializer/tool.js";
import { calculateCookieParser } from "../../http/cookie-parser/tool.js";
import {
  generatedCookiePools,
  generatedCookiePairSchema,
  checkGeneratedCookiePools,
  type GeneratedCookiePair,
} from "../http-cookie-construction.js";

export type CookieCorpusFormat = "canonical" | "quoted" | "compact" | "spaced";
export type HttpCookieRoundTripCorpusInput = {
  readonly names: readonly string[];
  readonly values: readonly string[];
  readonly caseCount: number;
  readonly pairsPerHeader: number;
  readonly duplicateNames: "allow" | "force" | "forbid";
  readonly formats: readonly CookieCorpusFormat[];
  readonly seed?: number;
};
export type HttpCookieRoundTripCorpusOutput = {
  readonly cases: readonly {
    readonly format: CookieCorpusFormat;
    readonly canonicalHeader: string;
    readonly header: string;
    readonly pairs: readonly GeneratedCookiePair[];
    readonly parsed: readonly GeneratedCookiePair[];
    readonly duplicateNames: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
const pairsSchema = {
  type: "array",
  maxItems: 16,
  items: generatedCookiePairSchema,
} as const;
const formatSchema = {
  type: "string",
  enum: ["canonical", "quoted", "compact", "spaced"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...generatedCookiePools,
    caseCount: { type: "integer", minimum: 1, maximum: 32 },
    pairsPerHeader: { type: "integer", minimum: 0, maximum: 16 },
    duplicateNames: { type: "string", enum: ["allow", "force", "forbid"] },
    formats: { type: "array", minItems: 1, maxItems: 4, items: formatSchema },
    seed: generatorSeedSchema,
  },
  required: [
    "names",
    "values",
    "caseCount",
    "pairsPerHeader",
    "duplicateNames",
    "formats",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          format: formatSchema,
          canonicalHeader: { type: "string", maxLength: 2048 },
          header: { type: "string", maxLength: 2048 },
          pairs: pairsSchema,
          parsed: pairsSchema,
          duplicateNames: {
            type: "array",
            maxItems: 8,
            items: { type: "string", minLength: 1, maxLength: 32 },
          },
        },
        required: [
          "format",
          "canonicalHeader",
          "header",
          "pairs",
          "parsed",
          "duplicateNames",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;

const isInput = (input: unknown): input is HttpCookieRoundTripCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpCookieRoundTripCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpCookieRoundTripCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.formats).size !== input.formats.length)
      simpleError("formats", "Entries must be distinct.", "duplicate_entries");
    checkGeneratedCookiePools(input.names, input.values);
    if (input.duplicateNames === "force" && input.pairsPerHeader < 2)
      simpleError(
        "pairsPerHeader",
        "Forced duplicate names require at least two pairs.",
        "infeasible_duplicate_names",
      );
    if (
      input.duplicateNames === "forbid" &&
      input.names.length < input.pairsPerHeader
    )
      simpleError(
        "names",
        "Distinct-name headers require enough distinct names.",
        "insufficient_names",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.caseCount }, () => {
      const format = random.pick(input.formats);
      const names =
        input.duplicateNames === "forbid"
          ? random.shuffle(input.names).slice(0, input.pairsPerHeader)
          : Array.from({ length: input.pairsPerHeader }, () =>
              random.pick(input.names),
            );
      if (input.duplicateNames === "force")
        names[names.length - 1] = random.pick(names.slice(0, -1));
      const pairs = names.map((name) => ({
        name,
        value: random.pick(input.values),
      }));
      const serialized = calculateCookieSerializer({ cookies: pairs });
      if (!serialized.ok)
        throw new Error(
          "Validated generated Cookie pairs were rejected by the serializer.",
        );
      const canonicalHeader = serialized.output.header;
      const header =
        format === "canonical"
          ? canonicalHeader
          : format === "quoted"
            ? pairs
                .map(({ name, value }) => name + '="' + value + '"')
                .join("; ")
            : format === "compact"
              ? pairs.map(({ name, value }) => name + "=" + value).join(";")
              : " " +
                pairs
                  .map(({ name, value }) => name + " = " + value)
                  .join(" ; ") +
                " ";
      const parsed = calculateCookieParser({ header });
      if (
        !parsed.ok ||
        parsed.output.cookies.length !== pairs.length ||
        parsed.output.cookies.some(
          (pair, index) =>
            pair.name !== pairs[index].name ||
            pair.value !== pairs[index].value,
        )
      )
        throw new Error(
          "A supported generated Cookie formatting variant failed its delegated round trip.",
        );
      const duplicateNames = [
        ...new Set(
          names.filter(
            (name) =>
              names.filter((candidate) => candidate === name).length > 1,
          ),
        ),
      ];
      return {
        format,
        canonicalHeader,
        header,
        pairs,
        parsed: parsed.output.cookies,
        duplicateNames,
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
export const httpCookieRoundTripCorpusExample = {
  input: {
    names: ["a", "b"],
    values: ["x", "%20", ""],
    caseCount: 2,
    pairsPerHeader: 3,
    duplicateNames: "force",
    formats: ["canonical", "quoted", "compact", "spaced"],
    seed: 42,
  },
  output: {
    cases: [
      {
        format: "compact",
        canonicalHeader: "a=%20; b=x; a=%20",
        header: "a=%20;b=x;a=%20",
        pairs: [
          {
            name: "a",
            value: "%20",
          },
          {
            name: "b",
            value: "x",
          },
          {
            name: "a",
            value: "%20",
          },
        ],
        parsed: [
          {
            name: "a",
            value: "%20",
          },
          {
            name: "b",
            value: "x",
          },
          {
            name: "a",
            value: "%20",
          },
        ],
        duplicateNames: ["a"],
      },
      {
        format: "spaced",
        canonicalHeader: "a=x; a=x; a=%20",
        header: " a = x ; a = x ; a = %20 ",
        pairs: [
          {
            name: "a",
            value: "x",
          },
          {
            name: "a",
            value: "x",
          },
          {
            name: "a",
            value: "%20",
          },
        ],
        parsed: [
          {
            name: "a",
            value: "x",
          },
          {
            name: "a",
            value: "x",
          },
          {
            name: "a",
            value: "%20",
          },
        ],
        duplicateNames: ["a"],
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  HttpCookieRoundTripCorpusInput,
  HttpCookieRoundTripCorpusOutput
>;
export const httpCookieRoundTripCorpusTool = createModelDefinition<
  HttpCookieRoundTripCorpusInput,
  HttpCookieRoundTripCorpusOutput
>({
  id: "random/http-cookie-round-trip-corpus",
  title: "Random HTTP Cookie Round-Trip Corpus Generator",
  description:
    "Compose bounded synthetic Cookie pairs from validated name/value fragments, select supported canonical/quoted/compact/spaced formatting, and delegate serialization/parsing while preserving duplicate-name order and encoded values; duplicate constraints are construction rules, not browser conformance, live cookies, or secret generation.",
  inputSchema,
  outputSchema,
  execute: calculateHttpCookieRoundTripCorpus,
});
export const runHttpCookieRoundTripCorpus =
  httpCookieRoundTripCorpusTool.execute;
export default httpCookieRoundTripCorpusTool;
