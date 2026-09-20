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
  choice,
  entrySchema,
  flatSchema,
  type Entry,
} from "../m500b-web-json-schema.js";
import {
  pick,
  distinct,
  entriesObject,
  pretty,
} from "../m500b-web-json-json.js";
export type ConfigurationOverrideChainFixtureInput = {
  readonly layers: readonly {
    readonly name: string;
    readonly entries: readonly Entry[];
  }[];
  readonly policy: "first" | "last";
  readonly nullPolicy: "value" | "delete";
  readonly seed?: number;
};
export type ConfigurationOverrideChainFixtureOutput = {
  readonly layerOrder: readonly string[];
  readonly merged: Readonly<
    Record<string, import("../m500b-web-json-schema.js").Scalar>
  >;
  readonly winners: readonly {
    readonly key: string;
    readonly layer: string;
    readonly deleted: boolean;
  }[];
  readonly pretty: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    layers: array(
      object({ name: label, entries: array(entrySchema, 16) }),
      8,
      1,
    ),
    policy: choice(["first", "last"]),
    nullPolicy: choice(["value", "delete"]),
    seed: generatorSeedSchema,
  },
  ["layers", "policy", "nullPolicy"],
);
export const outputSchema = object({
  layerOrder: array(text, 8, 1),
  merged: flatSchema,
  winners: array(
    object({ key: text, layer: text, deleted: { type: "boolean" } }),
    128,
  ),
  pretty: text,
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is ConfigurationOverrideChainFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateConfigurationOverrideChainFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ConfigurationOverrideChainFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.layers.map((l) => l.name),
      "layers",
    );
    for (const layer of input.layers) entriesObject(layer.entries, "layers");
    const random = createGeneratorRandom(input.seed, context),
      remaining = [...input.layers],
      ordered: ConfigurationOverrideChainFixtureInput["layers"][number][] = [];
    while (remaining.length) {
      const layer = pick(remaining, random);
      ordered.push(layer);
      remaining.splice(remaining.indexOf(layer), 1);
    }
    const values = new Map<
        string,
        import("../m500b-web-json-schema.js").Scalar
      >(),
      winners = new Map<
        string,
        { key: string; layer: string; deleted: boolean }
      >();
    for (const layer of ordered)
      for (const entry of layer.entries) {
        if (input.policy === "first" && winners.has(entry.key)) continue;
        const deleted = input.nullPolicy === "delete" && entry.value === null;
        if (deleted) values.delete(entry.key);
        else values.set(entry.key, entry.value === 0 ? 0 : entry.value);
        winners.set(entry.key, { key: entry.key, layer: layer.name, deleted });
      }
    const merged = Object.fromEntries(values);
    return toolSuccess({
      layerOrder: ordered.map((l) => l.name),
      merged,
      winners: [...winners.values()],
      pretty: pretty(merged),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const configurationOverrideChainFixtureExample = {
  input: {
    layers: [
      {
        name: "base",
        entries: [
          { key: "theme", value: "light" },
          { key: "size", value: 2 },
        ],
      },
      { name: "env", entries: [{ key: "theme", value: "dark" }] },
    ],
    policy: "last",
    nullPolicy: "value",
    seed: 42,
  },
  output: {
    layerOrder: ["env", "base"],
    merged: { theme: "light", size: 2 },
    winners: [
      { key: "theme", layer: "base", deleted: false },
      { key: "size", layer: "base", deleted: false },
    ],
    pretty: '{\n  "theme": "light",\n  "size": 2\n}\n',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ConfigurationOverrideChainFixtureInput,
  ConfigurationOverrideChainFixtureOutput
>;
export const configurationOverrideChainFixtureTool = createModelDefinition<
  ConfigurationOverrideChainFixtureInput,
  ConfigurationOverrideChainFixtureOutput
>({
  id: "random/configuration-override-chain-fixture",
  title: "Random Configuration Override Chain Fixture Generator",
  description:
    "Permute supplied flat configuration layers and retain first- or last-wins results, explicit null deletion and per-key winning-layer provenance.",
  inputSchema,
  outputSchema,
  execute: calculateConfigurationOverrideChainFixture,
});
export const runConfigurationOverrideChainFixture =
  configurationOverrideChainFixtureTool.execute;
export default configurationOverrideChainFixtureTool;
