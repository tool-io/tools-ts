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
  calculateNestedJsonDocument,
  inputSchema as documentInputSchema,
  type NestedJsonDocumentInput,
} from "../nested-json-document/tool.js";
import { calculateJsonFlatten } from "../../json/flatten/tool.js";
import { calculateJsonUnflatten } from "../../json/unflatten/tool.js";
import {
  generatedPrimitiveSchema,
  type GeneratedPrimitive,
} from "../typed-field-generation.js";
import type { GeneratedDocument } from "../structured-document-construction.js";

export type JsonFlatteningRoundTripCorpusInput = NestedJsonDocumentInput;
export type JsonFlatteningRoundTripCorpusOutput = {
  readonly documents: readonly {
    readonly original: GeneratedDocument["document"];
    readonly originalPretty: string;
    readonly flattened: Readonly<Record<string, GeneratedPrimitive>>;
    readonly rebuilt: GeneratedDocument["document"];
    readonly exactRoundTrip: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = documentInputSchema;
const documentSchema = { type: "object", additionalProperties: true } as const;
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
          original: documentSchema,
          originalPretty: {
            type: "string",
            minLength: 1,
            maxLength: 1000000,
            format: "application/json",
          },
          flattened: {
            type: "object",
            additionalProperties: generatedPrimitiveSchema,
          },
          rebuilt: documentSchema,
          exactRoundTrip: { type: "boolean" },
        },
        required: [
          "original",
          "originalPretty",
          "flattened",
          "rebuilt",
          "exactRoundTrip",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["documents", "randomness"],
} as const;

const isInput = (input: unknown): input is JsonFlatteningRoundTripCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonFlatteningRoundTripCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonFlatteningRoundTripCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const generated = calculateNestedJsonDocument(input, context);
    if (!generated.ok) return generated;
    const documents = generated.output.documents.map((source) => {
      const flattened = calculateJsonFlatten({ document: source.document });
      if (!flattened.ok)
        throw new Error(
          "A generated supported JSON document was rejected by the flatten core.",
        );
      const entries = (
        record: Readonly<Record<string, GeneratedPrimitive>>,
      ): [string, GeneratedPrimitive][] =>
        Object.entries(record).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
      if (
        JSON.stringify(entries(flattened.output.flat)) !==
        JSON.stringify(entries(source.flatFields))
      )
        throw new Error(
          "Delegated flattening disagreed with independently generated leaf truth.",
        );
      const rebuilt = calculateJsonUnflatten({ flat: flattened.output.flat });
      if (!rebuilt.ok)
        throw new Error(
          "A safely generated flat map was rejected by the unflatten core.",
        );
      const exactRoundTrip =
        JSON.stringify(source.document) ===
        JSON.stringify(rebuilt.output.document);
      if (!exactRoundTrip)
        throw new Error(
          "The restricted supported JSON subset failed its round trip.",
        );
      return {
        original: source.document,
        originalPretty: source.pretty,
        flattened: flattened.output.flat,
        rebuilt: rebuilt.output.document as GeneratedDocument["document"],
        exactRoundTrip,
      };
    });
    if (JSON.stringify(documents).length > 1000000)
      simpleError(
        "documentCount",
        "The retained round-trip corpus exceeds one million serialized characters.",
        "resource_limit",
      );
    return toolSuccess({ documents, randomness: generated.output.randomness });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonFlatteningRoundTripCorpusExample = {
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
        original: {
          profile: {
            name: "Grace",
          },
          scores: [3, 5],
        },
        originalPretty:
          '{\n  "profile": {\n    "name": "Grace"\n  },\n  "scores": [\n    3,\n    5\n  ]\n}\n',
        flattened: {
          "profile.name": "Grace",
          "scores.0": 3,
          "scores.1": 5,
        },
        rebuilt: {
          profile: {
            name: "Grace",
          },
          scores: [3, 5],
        },
        exactRoundTrip: true,
      },
      {
        original: {
          profile: {
            name: "Grace",
          },
          scores: [1, 3],
        },
        originalPretty:
          '{\n  "profile": {\n    "name": "Grace"\n  },\n  "scores": [\n    1,\n    3\n  ]\n}\n',
        flattened: {
          "profile.name": "Grace",
          "scores.0": 1,
          "scores.1": 3,
        },
        rebuilt: {
          profile: {
            name: "Grace",
          },
          scores: [1, 3],
        },
        exactRoundTrip: true,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  JsonFlatteningRoundTripCorpusInput,
  JsonFlatteningRoundTripCorpusOutput
>;
export const jsonFlatteningRoundTripCorpusTool = createModelDefinition<
  JsonFlatteningRoundTripCorpusInput,
  JsonFlatteningRoundTripCorpusOutput
>({
  id: "random/json-flattening-round-trip-corpus",
  title: "Random JSON Flattening Round-Trip Corpus Generator",
  description:
    "Reuse the random nested-document generator for its safe dot-path/contiguous-array subset, then actually flatten and rebuild every generated document with both existing cores; retain intermediate leaves and original/rebuilt forms, excluding sparse/mixed containers, reserved segments, literal-dot keys and empty-container loss cases rather than claiming arbitrary JSON round trips.",
  inputSchema,
  outputSchema,
  execute: calculateJsonFlatteningRoundTripCorpus,
});
export const runJsonFlatteningRoundTripCorpus =
  jsonFlatteningRoundTripCorpusTool.execute;
export default jsonFlatteningRoundTripCorpusTool;
