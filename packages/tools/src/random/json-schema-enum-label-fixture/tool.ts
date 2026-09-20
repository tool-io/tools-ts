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
  label,
  bounded,
  boolean,
  nullableText,
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type JsonSchemaEnumLabelFixtureInput = {
  readonly mappings: readonly {
    readonly code: string;
    readonly label: string;
  }[];
  readonly unknownControl: boolean;
  readonly count: number;
  readonly seed?: number;
};
export type JsonSchemaEnumLabelFixtureOutput = {
  readonly cases: readonly {
    readonly code: string;
    readonly known: boolean;
    readonly label: string | null;
    readonly pretty: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    mappings: array(object({ code: label, label: text }), 16, 1),
    unknownControl: boolean,
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["mappings", "unknownControl", "count"],
);
export const outputSchema = object({
  cases: array(
    object({ code: text, known: boolean, label: nullableText, pretty: text }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is JsonSchemaEnumLabelFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonSchemaEnumLabelFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonSchemaEnumLabelFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.mappings.map((m) => m.code),
      "mappings",
    );
    let unknown = "__unknown__";
    while (input.mappings.some((m) => m.code === unknown)) unknown += "_";
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const chosen = pick(input.mappings, random),
          code = input.unknownControl ? unknown : chosen.code,
          mapping = input.mappings.find((m) => m.code === code),
          label = mapping?.label ?? null;
        return {
          code,
          known: mapping !== undefined,
          label,
          pretty: pretty({ code, label }),
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
export const jsonSchemaEnumLabelFixtureExample = {
  input: {
    mappings: [
      { code: "A", label: "Alpha" },
      { code: "B", label: "Beta" },
    ],
    unknownControl: false,
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        code: "B",
        known: true,
        label: "Beta",
        pretty: '{\n  "code": "B",\n  "label": "Beta"\n}\n',
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonSchemaEnumLabelFixtureInput,
  JsonSchemaEnumLabelFixtureOutput
>;
export const jsonSchemaEnumLabelFixtureTool = createModelDefinition<
  JsonSchemaEnumLabelFixtureInput,
  JsonSchemaEnumLabelFixtureOutput
>({
  id: "random/json-schema-enum-label-fixture",
  title: "Random JSON Schema Enum Label Fixture Generator",
  description:
    "Construct caller-supplied enum code and label examples with guaranteed unknown-code controls and nullable lookup answers.",
  inputSchema,
  outputSchema,
  execute: calculateJsonSchemaEnumLabelFixture,
});
export const runJsonSchemaEnumLabelFixture =
  jsonSchemaEnumLabelFixtureTool.execute;
export default jsonSchemaEnumLabelFixtureTool;
