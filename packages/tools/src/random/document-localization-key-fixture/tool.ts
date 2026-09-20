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
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type DocumentLocalizationKeyFixtureInput = {
  readonly catalog: readonly {
    readonly key: string;
    readonly message: string;
  }[];
  readonly usageCount: number;
  readonly removeUsedKey: boolean;
  readonly orphanControl: boolean;
  readonly seed?: number;
};
export type DocumentLocalizationKeyFixtureOutput = {
  readonly catalog: readonly {
    readonly key: string;
    readonly message: string;
  }[];
  readonly usages: readonly string[];
  readonly missingKeys: readonly string[];
  readonly repeatedKeys: readonly string[];
  readonly unusedKeys: readonly string[];
  readonly pretty: string;
  readonly randomness: GeneratorReplay;
};
const catalogEntry = object({ key: label, message: text });
export const inputSchema = object(
  {
    catalog: array(catalogEntry, 16, 1),
    usageCount: bounded(1, 31),
    removeUsedKey: boolean,
    orphanControl: boolean,
    seed: generatorSeedSchema,
  },
  ["catalog", "usageCount", "removeUsedKey", "orphanControl"],
);
export const outputSchema = object({
  catalog: array(catalogEntry, 16),
  usages: array(text, 32, 1),
  missingKeys: array(text, 32),
  repeatedKeys: array(text, 16),
  unusedKeys: array(text, 16),
  pretty: text,
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is DocumentLocalizationKeyFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateDocumentLocalizationKeyFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DocumentLocalizationKeyFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.catalog.map((c) => c.key),
      "catalog",
    );
    const random = createGeneratorRandom(input.seed, context),
      usages = Array.from(
        { length: input.usageCount },
        () => pick(input.catalog, random).key,
      ),
      removed = input.removeUsedKey ? pick(usages, random) : null,
      catalog = input.catalog
        .filter((c) => c.key !== removed)
        .map((c) => ({ ...c }));
    let orphan = "__orphan__";
    while (input.catalog.some((c) => c.key === orphan)) orphan += "_";
    if (input.orphanControl) usages.push(orphan);
    const counts = new Map<string, number>();
    for (const key of usages) counts.set(key, (counts.get(key) ?? 0) + 1);
    const missingKeys = [...counts.keys()].filter(
        (key) => !catalog.some((c) => c.key === key),
      ),
      repeatedKeys = [...counts]
        .filter(([, count]) => count > 1)
        .map(([key]) => key),
      unusedKeys = catalog.filter((c) => !counts.has(c.key)).map((c) => c.key);
    return toolSuccess({
      catalog,
      usages,
      missingKeys,
      repeatedKeys,
      unusedKeys,
      pretty: pretty(
        Object.fromEntries(catalog.map((c) => [c.key, c.message])),
      ),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const documentLocalizationKeyFixtureExample = {
  input: {
    catalog: [
      { key: "title", message: "Hello" },
      { key: "body", message: "Text" },
    ],
    usageCount: 3,
    removeUsedKey: false,
    orphanControl: true,
    seed: 42,
  },
  output: {
    catalog: [
      { key: "title", message: "Hello" },
      { key: "body", message: "Text" },
    ],
    usages: ["body", "title", "body", "__orphan__"],
    missingKeys: ["__orphan__"],
    repeatedKeys: ["body"],
    unusedKeys: [],
    pretty: '{\n  "title": "Hello",\n  "body": "Text"\n}\n',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  DocumentLocalizationKeyFixtureInput,
  DocumentLocalizationKeyFixtureOutput
>;
export const documentLocalizationKeyFixtureTool = createModelDefinition<
  DocumentLocalizationKeyFixtureInput,
  DocumentLocalizationKeyFixtureOutput
>({
  id: "random/document-localization-key-fixture",
  title: "Random Document Localization Key Fixture Generator",
  description:
    "Construct supplied message-key usages with explicit removed-catalog and orphan controls, retaining repeated, missing and unused-key answers.",
  inputSchema,
  outputSchema,
  execute: calculateDocumentLocalizationKeyFixture,
});
export const runDocumentLocalizationKeyFixture =
  documentLocalizationKeyFixtureTool.execute;
export default documentLocalizationKeyFixtureTool;
