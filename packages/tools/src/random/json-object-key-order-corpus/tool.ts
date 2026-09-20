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
  entrySchema,
  flatSchema,
  type Entry,
  type Scalar,
} from "../m500b-web-json-schema.js";
import { pick, entriesObject, pretty } from "../m500b-web-json-json.js";
export type JsonObjectKeyOrderCorpusInput = {
  readonly entries: readonly Entry[];
  readonly count: number;
  readonly seed?: number;
};
export type JsonObjectKeyOrderCorpusOutput = {
  readonly variants: readonly {
    readonly insertionKeys: readonly string[];
    readonly enumerationKeys: readonly string[];
    readonly document: Readonly<Record<string, Scalar>>;
    readonly compact: string;
    readonly pretty: string;
    readonly semanticallyEqual: boolean;
    readonly sameSerialization: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    entries: array(entrySchema, 16, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["entries", "count"],
);
export const outputSchema = object({
  variants: array(
    object({
      insertionKeys: array(text, 16),
      enumerationKeys: array(text, 16),
      document: flatSchema,
      compact: text,
      pretty: text,
      semanticallyEqual: boolean,
      sameSerialization: boolean,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is JsonObjectKeyOrderCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonObjectKeyOrderCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonObjectKeyOrderCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const original = entriesObject(input.entries),
      random = createGeneratorRandom(input.seed, context),
      baseline = JSON.stringify(original);
    const variants = Array.from({ length: input.count }, () => {
      const remaining = [...input.entries],
        permutation: Entry[] = [];
      while (remaining.length) {
        const entry = pick(remaining, random);
        permutation.push(entry);
        remaining.splice(remaining.indexOf(entry), 1);
      }
      const document = entriesObject(permutation),
        compact = JSON.stringify(document);
      return {
        insertionKeys: permutation.map((e) => e.key),
        enumerationKeys: Object.keys(document),
        document,
        compact,
        pretty: pretty(document),
        semanticallyEqual: Object.keys(original).every(
          (key) =>
            Object.hasOwn(document, key) && document[key] === original[key],
        ),
        sameSerialization: baseline === compact,
      };
    });
    return toolSuccess({
      variants,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonObjectKeyOrderCorpusExample = {
  input: {
    entries: [
      { key: "2", value: "two" },
      { key: "a", value: 7 },
      { key: "1", value: "one" },
    ],
    count: 1,
    seed: 42,
  },
  output: {
    variants: [
      {
        insertionKeys: ["a", "2", "1"],
        enumerationKeys: ["1", "2", "a"],
        document: { "1": "one", "2": "two", a: 7 },
        compact: '{"1":"one","2":"two","a":7}',
        pretty: '{\n  "1": "one",\n  "2": "two",\n  "a": 7\n}\n',
        semanticallyEqual: true,
        sameSerialization: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonObjectKeyOrderCorpusInput,
  JsonObjectKeyOrderCorpusOutput
>;
export const jsonObjectKeyOrderCorpusTool = createModelDefinition<
  JsonObjectKeyOrderCorpusInput,
  JsonObjectKeyOrderCorpusOutput
>({
  id: "random/json-object-key-order-corpus",
  title: "Random JSON Object Key Order Corpus Generator",
  description:
    "Permute supplied primitive entries and retain semantic equality, serialized differences and ECMAScript integer-index key ordering.",
  inputSchema,
  outputSchema,
  execute: calculateJsonObjectKeyOrderCorpus,
});
export const runJsonObjectKeyOrderCorpus = jsonObjectKeyOrderCorpusTool.execute;
export default jsonObjectKeyOrderCorpusTool;
