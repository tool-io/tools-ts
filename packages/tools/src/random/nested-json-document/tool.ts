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
import {
  generatedFieldsSchema,
  generatedPrimitiveSchema,
  type GeneratedField,
} from "../typed-field-generation.js";
import {
  validateDocumentFields,
  generateStructuredDocument,
  type GeneratedDocument,
} from "../structured-document-construction.js";

export type NestedJsonDocumentInput = {
  readonly documentCount: number;
  readonly fields: readonly GeneratedField[];
  readonly indent: number;
  readonly seed?: number;
};
export type NestedJsonDocumentOutput = {
  readonly documents: readonly GeneratedDocument[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentCount: { type: "integer", minimum: 1, maximum: 64 },
    fields: generatedFieldsSchema,
    indent: { type: "integer", minimum: 1, maximum: 8 },
    seed: generatorSeedSchema,
  },
  required: ["documentCount", "fields", "indent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documents: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          flatFields: {
            type: "object",
            additionalProperties: generatedPrimitiveSchema,
          },
          document: { type: "object", additionalProperties: true },
          pretty: {
            type: "string",
            minLength: 1,
            maxLength: 1000000,
            format: "application/json",
          },
        },
        required: ["flatFields", "document", "pretty"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["documents", "randomness"],
} as const;

const isInput = (input: unknown): input is NestedJsonDocumentInput =>
  matchesModelInput(input, inputSchema);
export const calculateNestedJsonDocument = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<NestedJsonDocumentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    validateDocumentFields(input.fields, "fields");
    if (input.documentCount * input.fields.length > 4096)
      simpleError(
        "documentCount",
        "At most 4,096 generated leaves are supported.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      documents = Array.from({ length: input.documentCount }, () =>
        generateStructuredDocument(input.fields, random, input.indent),
      );
    if (JSON.stringify(documents).length > 1_000_000)
      simpleError(
        "documentCount",
        "Serialized generated documents exceed one million characters.",
        "resource_limit",
      );
    return toolSuccess({
      documents,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const nestedJsonDocumentExample = {
  input: {
    documentCount: 2,
    fields: [
      {
        key: "profile.name",
        kind: "text",
        choices: ["Ada", "Grace"],
      },
      {
        key: "scores.0",
        kind: "integer",
        minimum: 1,
        maximum: 5,
      },
      {
        key: "scores.1",
        kind: "integer",
        minimum: 1,
        maximum: 5,
      },
    ],
    indent: 2,
    seed: 42,
  },
  output: {
    documents: [
      {
        flatFields: {
          "profile.name": "Grace",
          "scores.0": 3,
          "scores.1": 5,
        },
        document: {
          profile: {
            name: "Grace",
          },
          scores: [3, 5],
        },
        pretty:
          '{\n  "profile": {\n    "name": "Grace"\n  },\n  "scores": [\n    3,\n    5\n  ]\n}\n',
      },
      {
        flatFields: {
          "profile.name": "Grace",
          "scores.0": 1,
          "scores.1": 3,
        },
        document: {
          profile: {
            name: "Grace",
          },
          scores: [1, 3],
        },
        pretty:
          '{\n  "profile": {\n    "name": "Grace"\n  },\n  "scores": [\n    1,\n    3\n  ]\n}\n',
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<NestedJsonDocumentInput, NestedJsonDocumentOutput>;
export const nestedJsonDocumentTool = createModelDefinition<
  NestedJsonDocumentInput,
  NestedJsonDocumentOutput
>({
  id: "random/nested-json-document",
  title: "Random Nested JSON Document Generator",
  description:
    "Generate exact-count nested object/contiguous-array JSON documents from bounded dot-path primitive templates and delegate unflattening/pretty printing; reject leaf conflicts, sparse arrays and inherited-property segments before calling the existing core.",
  inputSchema,
  outputSchema,
  execute: calculateNestedJsonDocument,
});
export const runNestedJsonDocument = nestedJsonDocumentTool.execute;
export default nestedJsonDocumentTool;
