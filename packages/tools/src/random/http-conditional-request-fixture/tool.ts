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
  integer,
  boolean,
  choice,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { calculateEtagParser } from "../../http/etag-parser/tool.js";
export type HttpConditionalRequestFixtureInput = {
  readonly currentEtag: string;
  readonly tags: readonly string[];
  readonly methods: readonly ("GET" | "HEAD" | "PUT")[];
  readonly conditions: readonly (
    "if-match" | "if-none-match" | "if-modified-since" | "if-unmodified-since"
  )[];
  readonly exists: boolean;
  readonly modifiedSeconds: number;
  readonly conditionSeconds: number;
  readonly count: number;
  readonly seed?: number;
};
export type HttpConditionalRequestFixtureOutput = {
  readonly cases: readonly {
    readonly method: string;
    readonly condition: string;
    readonly headers: readonly {
      readonly name: string;
      readonly value: string;
    }[];
    readonly status: number;
    readonly reason: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    currentEtag: text,
    tags: array(text, 16, 1),
    methods: array(choice(["GET", "HEAD", "PUT"]), 3, 1),
    conditions: array(
      choice([
        "if-match",
        "if-none-match",
        "if-modified-since",
        "if-unmodified-since",
      ]),
      4,
      1,
    ),
    exists: boolean,
    modifiedSeconds: integer,
    conditionSeconds: integer,
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  [
    "currentEtag",
    "tags",
    "methods",
    "conditions",
    "exists",
    "modifiedSeconds",
    "conditionSeconds",
    "count",
  ],
);
export const outputSchema = object({
  cases: array(
    object({
      method: text,
      condition: text,
      headers: array(object({ name: text, value: text }), 2),
      status: bounded(200, 412),
      reason: text,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is HttpConditionalRequestFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpConditionalRequestFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpConditionalRequestFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (
      /[\r\n]/u.test(input.currentEtag) ||
      input.tags.some((t) => /[\r\n]/u.test(t))
    )
      simpleError(
        "tags",
        "Entity tags must contain no line breaks.",
        "invalid_etag",
      );
    const current = calculateEtagParser({ etag: input.currentEtag });
    for (const tag of input.tags) calculateEtagParser({ etag: tag });
    for (const seconds of [input.modifiedSeconds, input.conditionSeconds])
      if (Math.abs(seconds) > 253402300799 || seconds < -62167219200)
        simpleError(
          "conditionSeconds",
          "HTTP fixture dates support Gregorian years 0000 through 9999.",
          "invalid_date",
        );
    const date = new Date(input.conditionSeconds * 1000).toUTCString(),
      random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const method = pick(input.methods, random),
        condition = pick(input.conditions, random),
        tag = pick(input.tags, random),
        parsed = calculateEtagParser({ etag: tag }),
        safe = method !== "PUT";
      let status = 200,
        reason = "proceed";
      const headers = [
        { name: condition, value: condition.includes("since") ? date : tag },
      ];
      if (
        condition === "if-match" &&
        (!input.exists ||
          parsed.weak ||
          current.weak ||
          parsed.opaqueValue !== current.opaqueValue)
      ) {
        status = 412;
        reason = "strong-tag-mismatch";
      } else if (
        condition === "if-none-match" &&
        input.exists &&
        parsed.opaqueValue === current.opaqueValue
      ) {
        status = safe ? 304 : 412;
        reason = "weak-tag-match";
      } else if (
        condition === "if-modified-since" &&
        safe &&
        input.exists &&
        input.modifiedSeconds <= input.conditionSeconds
      ) {
        status = 304;
        reason = "not-modified";
      } else if (
        condition === "if-unmodified-since" &&
        input.exists &&
        input.modifiedSeconds > input.conditionSeconds
      ) {
        status = 412;
        reason = "modified-since";
      }
      if (condition === "if-match" || condition === "if-none-match")
        headers.push({
          name:
            condition === "if-match"
              ? "if-unmodified-since"
              : "if-modified-since",
          value: date,
        });
      return { method, condition, headers, status, reason };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const httpConditionalRequestFixtureExample = {
  input: {
    currentEtag: '"v2"',
    tags: ['W/"v2"'],
    methods: ["GET"],
    conditions: ["if-none-match"],
    exists: true,
    modifiedSeconds: 100,
    conditionSeconds: 0,
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        method: "GET",
        condition: "if-none-match",
        headers: [
          { name: "if-none-match", value: 'W/"v2"' },
          { name: "if-modified-since", value: "Thu, 01 Jan 1970 00:00:00 GMT" },
        ],
        status: 304,
        reason: "weak-tag-match",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HttpConditionalRequestFixtureInput,
  HttpConditionalRequestFixtureOutput
>;
export const httpConditionalRequestFixtureTool = createModelDefinition<
  HttpConditionalRequestFixtureInput,
  HttpConditionalRequestFixtureOutput
>({
  id: "random/http-conditional-request-fixture",
  title: "Random HTTP Conditional Request Fixture Generator",
  description:
    "Construct single-tag conditional requests with explicit existence and epoch-second date inputs, applying tag-before-date precedence and GET/HEAD response decisions.",
  inputSchema,
  outputSchema,
  execute: calculateHttpConditionalRequestFixture,
});
export const runHttpConditionalRequestFixture =
  httpConditionalRequestFixtureTool.execute;
export default httpConditionalRequestFixtureTool;
