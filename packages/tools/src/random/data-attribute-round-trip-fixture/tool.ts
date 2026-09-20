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
import {
  calculateDataAttributeNamingValidator,
  dataAttributeNamingValidatorOutputSchema,
  type DataAttributeNamingValidatorOutput,
} from "../../html/data-attribute-naming-validator/tool.js";

export type Input = {
  readonly suffixes: readonly string[];
  readonly values: readonly string[];
  readonly uppercaseControl: boolean;
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly sourceName: string;
    readonly originalValue: string;
    readonly encodedValue: string;
    readonly tag: string;
    readonly parsedName: string;
    readonly parsedValue: string;
    readonly sourceCheck: DataAttributeNamingValidatorOutput;
    readonly parsedCheck: DataAttributeNamingValidatorOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const suffix = {
  type: "string",
  minLength: 1,
  maxLength: 64,
  pattern: "^[a-z][a-z0-9-]*(?![\\s\\S])",
} as const;
export const inputSchema = object(
  {
    suffixes: list(suffix),
    values: list(text),
    uppercaseControl: bool,
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["suffixes", "values", "uppercaseControl", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      sourceName: text,
      originalValue: text,
      encodedValue: { type: "string", maxLength: 2048 },
      tag: markup,
      parsedName: text,
      parsedValue: { type: "string", maxLength: 2048 },
      sourceCheck: dataAttributeNamingValidatorOutputSchema,
      parsedCheck: dataAttributeNamingValidatorOutputSchema,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateDataAttributeRoundTripFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const base = "data-" + choose(input.suffixes, random),
          sourceName = input.uppercaseControl ? base.toUpperCase() : base,
          originalValue = choose(input.values, random),
          encodedValue = escape(originalValue),
          tag = "<div " + sourceName + '="' + encodedValue + '">',
          parsed = parse(tag),
          attribute = parsed.attributes[0];
        if (!attribute) throw new Error("Constructed data attribute absent");
        const source = calculateDataAttributeNamingValidator({
            name: sourceName,
          }),
          normalized = calculateDataAttributeNamingValidator({
            name: attribute.name,
          });
        if (!source.ok || !normalized.ok)
          throw new Error("Constructed data name rejected");
        if (attribute.value !== encodedValue)
          throw new Error("Lexical data value failed raw round trip");
        return {
          sourceName,
          originalValue,
          encodedValue,
          tag,
          parsedName: attribute.name,
          parsedValue: attribute.value,
          sourceCheck: source.output,
          parsedCheck: normalized.output,
        };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const dataAttributeRoundTripFixtureExample = {
  input: {
    suffixes: ["item-count", "user-id"],
    values: ["A&B", 'x"y'],
    uppercaseControl: true,
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        sourceName: "DATA-USER-ID",
        originalValue: "A&B",
        encodedValue: "A&amp;B",
        tag: '<div DATA-USER-ID="A&amp;B">',
        parsedName: "data-user-id",
        parsedValue: "A&amp;B",
        sourceCheck: { valid: false, datasetKey: "" },
        parsedCheck: { valid: true, datasetKey: "userId" },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const dataAttributeRoundTripFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/data-attribute-round-trip-fixture",
  title: "Random Data Attribute Round-Trip Fixture Generator",
  description:
    "Construct caller data-* names and escaped values with optional uppercase controls, comparing source and parsed name checks and raw lexical round trips without a DOM dataset claim.",
  inputSchema,
  outputSchema,
  execute: calculateDataAttributeRoundTripFixture,
});
export const runDataAttributeRoundTripFixture =
  dataAttributeRoundTripFixtureTool.execute;
export default dataAttributeRoundTripFixtureTool;
