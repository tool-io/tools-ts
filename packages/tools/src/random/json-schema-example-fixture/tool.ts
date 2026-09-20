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
  choice,
  integer,
  flatSchema,
  type Scalar,
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type FixtureSchemaField = {
  readonly key: string;
  readonly required: boolean;
} & (
  | { readonly kind: "string"; readonly choices: readonly string[] }
  | {
      readonly kind: "integer";
      readonly minimum: number;
      readonly maximum: number;
    }
  | { readonly kind: "boolean" }
);
export type JsonSchemaExampleFixtureInput = {
  readonly fields: readonly FixtureSchemaField[];
  readonly control: "valid" | "missing-required" | "wrong-type";
  readonly count: number;
  readonly seed?: number;
};
export type JsonSchemaExampleFixtureOutput = {
  readonly documents: readonly {
    readonly document: Readonly<Record<string, Scalar>>;
    readonly pretty: string;
    readonly valid: boolean;
    readonly issueField: string;
    readonly issueCode: string;
  }[];
  readonly randomness: GeneratorReplay;
};
const fieldSchema = {
  type: "object",
  additionalProperties: true,
  anyOf: [
    object({
      key: label,
      required: boolean,
      kind: { type: "string", const: "string" },
      choices: array(text, 16, 1),
    }),
    object({
      key: label,
      required: boolean,
      kind: { type: "string", const: "integer" },
      minimum: integer,
      maximum: integer,
    }),
    object({
      key: label,
      required: boolean,
      kind: { type: "string", const: "boolean" },
    }),
  ],
} as const;
export const inputSchema = object(
  {
    fields: array(fieldSchema, 16, 1),
    control: choice(["valid", "missing-required", "wrong-type"]),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["fields", "control", "count"],
);
export const outputSchema = object({
  documents: array(
    object({
      document: flatSchema,
      pretty: text,
      valid: boolean,
      issueField: text,
      issueCode: text,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is JsonSchemaExampleFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonSchemaExampleFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonSchemaExampleFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.fields.map((f) => f.key),
      "fields",
    );
    for (const f of input.fields)
      if (
        f.kind === "integer" &&
        (f.minimum > f.maximum ||
          !Number.isSafeInteger(f.maximum - f.minimum + 1))
      )
        simpleError(
          "fields",
          "Integer ranges must be ordered and safely sampleable.",
          "invalid_integer_range",
        );
    const required = input.fields.filter((f) => f.required);
    if (input.control === "missing-required" && !required.length)
      simpleError(
        "control",
        "A missing-required control needs a required field.",
        "no_required_field",
      );
    const random = createGeneratorRandom(input.seed, context),
      documents = Array.from({ length: input.count }, () => {
        const entries = input.fields.map(
            (f) =>
              [
                f.key,
                f.kind === "string"
                  ? pick(f.choices, random)
                  : f.kind === "integer"
                    ? random.integer(f.minimum, f.maximum)
                    : random.unit() < 0.5,
              ] as const,
          ),
          document: Record<string, Scalar> = Object.fromEntries(entries);
        let issueField = "",
          issueCode = "";
        if (input.control !== "valid") {
          const f = pick(
            input.control === "missing-required" ? required : input.fields,
            random,
          );
          issueField = f.key;
          if (input.control === "missing-required") {
            delete document[f.key];
            issueCode = "required";
          } else {
            Object.defineProperty(document, f.key, {
              value: f.kind === "string" ? 7 : "invalid-type",
              enumerable: true,
              writable: true,
              configurable: true,
            });
            issueCode = "type";
          }
        }
        return {
          document,
          pretty: pretty(document),
          valid: issueCode === "",
          issueField,
          issueCode,
        };
      });
    return toolSuccess({
      documents,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonSchemaExampleFixtureExample = {
  input: {
    fields: [
      { key: "count", required: true, kind: "integer", minimum: 2, maximum: 4 },
      {
        key: "color",
        required: false,
        kind: "string",
        choices: ["red", "blue"],
      },
    ],
    control: "valid",
    count: 1,
    seed: 42,
  },
  output: {
    documents: [
      {
        document: { count: 3, color: "red" },
        pretty: '{\n  "count": 3,\n  "color": "red"\n}\n',
        valid: true,
        issueField: "",
        issueCode: "",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonSchemaExampleFixtureInput,
  JsonSchemaExampleFixtureOutput
>;
export const jsonSchemaExampleFixtureTool = createModelDefinition<
  JsonSchemaExampleFixtureInput,
  JsonSchemaExampleFixtureOutput
>({
  id: "random/json-schema-example-fixture",
  title: "Random JSON Schema Example Fixture Generator",
  description:
    "Synthesize flat string-enum, safe-integer-range and boolean schema examples with controlled missing-field or wrong-type labels.",
  inputSchema,
  outputSchema,
  execute: calculateJsonSchemaExampleFixture,
});
export const runJsonSchemaExampleFixture = jsonSchemaExampleFixtureTool.execute;
export default jsonSchemaExampleFixtureTool;
