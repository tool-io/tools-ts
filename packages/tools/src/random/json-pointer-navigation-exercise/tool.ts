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
import { calculateJsonPointer } from "../../json/pointer/tool.js";
import {
  generateFieldValue,
  validateGeneratedFields,
  generatedPrimitiveSchema,
  type GeneratedPrimitive,
} from "../typed-field-generation.js";

export type PointerValueKind = "integer" | "text" | "boolean" | "null";
export type JsonPointerNavigationExerciseInput = {
  readonly keys: readonly string[];
  readonly recordCount: number;
  readonly valueKinds: readonly PointerValueKind[];
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly textChoices: readonly string[];
  readonly trueProbability: number;
  readonly queryCount: number;
  readonly missingProbability: number;
  readonly seed?: number;
};
export type JsonPointerNavigationExerciseOutput = {
  readonly document: {
    readonly records: readonly Readonly<Record<string, GeneratedPrimitive>>[];
  };
  readonly queries: readonly {
    readonly pointer: string;
    readonly found: boolean;
    readonly valueJson: string | null;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keys: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: { type: "string", maxLength: 32 },
    },
    recordCount: { type: "integer", minimum: 1, maximum: 16 },
    valueKinds: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: { type: "string", enum: ["integer", "text", "boolean", "null"] },
    },
    minimumValue: { type: "integer" },
    maximumValue: { type: "integer" },
    textChoices: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "string", maxLength: 64 },
    },
    trueProbability: { type: "number", minimum: 0, maximum: 1 },
    queryCount: { type: "integer", minimum: 1, maximum: 64 },
    missingProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  required: [
    "keys",
    "recordCount",
    "valueKinds",
    "minimumValue",
    "maximumValue",
    "textChoices",
    "trueProbability",
    "queryCount",
    "missingProbability",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    document: {
      type: "object",
      additionalProperties: false,
      properties: {
        records: {
          type: "array",
          minItems: 1,
          maxItems: 16,
          items: {
            type: "object",
            additionalProperties: generatedPrimitiveSchema,
          },
        },
      },
      required: ["records"],
    },
    queries: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          pointer: { type: "string", maxLength: 128 },
          found: { type: "boolean" },
          valueJson: {
            anyOf: [{ type: "string", maxLength: 65536 }, { type: "null" }],
          },
        },
        required: ["pointer", "found", "valueJson"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["document", "queries", "randomness"],
} as const;
const resolveOwnTokens = (
  document: unknown,
  tokens: readonly string[],
): { found: boolean; valueJson: string | null } => {
  let value: unknown = document;
  for (const token of tokens) {
    if (
      typeof value !== "object" ||
      value === null ||
      !Object.hasOwn(value, token)
    )
      return { found: false, valueJson: null };
    value = (value as Readonly<Record<string, unknown>>)[token];
  }
  return { found: true, valueJson: JSON.stringify(value) };
};
const isInput = (input: unknown): input is JsonPointerNavigationExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonPointerNavigationExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonPointerNavigationExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.keys).size !== input.keys.length)
      simpleError("keys", "Entries must be distinct.", "duplicate_entries");
    if (new Set(input.valueKinds).size !== input.valueKinds.length)
      simpleError(
        "valueKinds",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    validateGeneratedFields(
      [
        {
          key: "value",
          kind: "integer",
          minimum: input.minimumValue,
          maximum: input.maximumValue,
        },
      ],
      "minimumValue",
    );
    const random = createGeneratorRandom(input.seed, context);
    const records = Array.from({ length: input.recordCount }, () =>
        Object.fromEntries(
          input.keys.map((key) => {
            const kind = random.pick(input.valueKinds);
            const value: GeneratedPrimitive =
              kind === "null"
                ? null
                : generateFieldValue(
                    kind === "integer"
                      ? {
                          key: "value",
                          kind,
                          minimum: input.minimumValue,
                          maximum: input.maximumValue,
                        }
                      : kind === "text"
                        ? { key: "value", kind, choices: input.textChoices }
                        : {
                            key: "value",
                            kind,
                            trueProbability: input.trueProbability,
                          },
                    random,
                  );
            return [key, value];
          }),
        ),
      ),
      document = { records },
      paths: string[][] = [[], ["records"]];
    records.forEach((_, index) => {
      paths.push(["records", String(index)]);
      for (const key of input.keys) paths.push(["records", String(index), key]);
    });
    let missingKey = "missing-0",
      suffix = 0;
    while (
      input.keys.includes(missingKey) ||
      Object.hasOwn(Object.prototype, missingKey)
    )
      missingKey = "missing-" + ++suffix;
    const queries = Array.from({ length: input.queryCount }, () => {
      const missing = random.unit() < input.missingProbability;
      const tokens = missing
        ? random.integer(0, 1) === 0
          ? ["records", String(records.length + random.integer(0, 3))]
          : [
              "records",
              String(random.integer(0, records.length - 1)),
              missingKey,
            ]
        : random.pick(paths);
      const pointer = tokens
          .map(
            (token) => "/" + token.replaceAll("~", "~0").replaceAll("/", "~1"),
          )
          .join(""),
        expected = resolveOwnTokens(document, tokens),
        result = calculateJsonPointer({ document, pointer });
      if (
        !result.ok ||
        result.output.found !== expected.found ||
        result.output.valueJson !== expected.valueJson
      )
        throw new Error(
          "Generated own-property pointer expectations disagreed with the resolver.",
        );
      return { pointer, ...result.output };
    });
    return toolSuccess({
      document,
      queries,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonPointerNavigationExerciseExample = {
  input: {
    keys: ["a/b", "~x"],
    recordCount: 2,
    valueKinds: ["integer", "null"],
    minimumValue: 0,
    maximumValue: 4,
    textChoices: ["x"],
    trueProbability: 0.5,
    queryCount: 4,
    missingProbability: 0.25,
    seed: 42,
  },
  output: {
    document: {
      records: [
        {
          "a/b": null,
          "~x": 4,
        },
        {
          "a/b": null,
          "~x": 2,
        },
      ],
    },
    queries: [
      {
        pointer: "/records/0/~0x",
        found: true,
        valueJson: "4",
      },
      {
        pointer: "/records/0/a~1b",
        found: true,
        valueJson: "null",
      },
      {
        pointer: "/records/1/missing-0",
        found: false,
        valueJson: null,
      },
      {
        pointer: "/records",
        found: true,
        valueJson: '[{"a/b":null,"~x":4},{"a/b":null,"~x":2}]',
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  JsonPointerNavigationExerciseInput,
  JsonPointerNavigationExerciseOutput
>;
export const jsonPointerNavigationExerciseTool = createModelDefinition<
  JsonPointerNavigationExerciseInput,
  JsonPointerNavigationExerciseOutput
>({
  id: "random/json-pointer-navigation-exercise",
  title: "Random JSON Pointer Navigation Exercise Generator",
  description:
    "Generate bounded object/array documents with caller key strings and primitive values, then compose canonical escaped RFC 6901 navigation questions and deliberate missing paths with delegated answers; preserve found-null versus missing distinction, avoid inherited-property missing keys, and do not claim the old resolver enforces every pointer syntax restriction.",
  inputSchema,
  outputSchema,
  execute: calculateJsonPointerNavigationExercise,
});
export const runJsonPointerNavigationExercise =
  jsonPointerNavigationExerciseTool.execute;
export default jsonPointerNavigationExerciseTool;
