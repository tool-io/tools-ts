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
  nullableText,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type JsonReferenceIntegrityFixtureInput = {
  readonly ids: readonly string[];
  readonly mode: "chain" | "missing" | "cycle";
  readonly seed?: number;
};
export type JsonReferenceIntegrityFixtureOutput = {
  readonly records: readonly {
    readonly id: string;
    readonly next: string | null;
  }[];
  readonly missingReferences: readonly {
    readonly from: string;
    readonly target: string;
  }[];
  readonly cycleMembers: readonly string[];
  readonly validReferences: boolean;
  readonly pretty: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    ids: array(label, 16, 2),
    mode: choice(["chain", "missing", "cycle"]),
    seed: generatorSeedSchema,
  },
  ["ids", "mode"],
);
export const outputSchema = object({
  records: array(object({ id: text, next: nullableText }), 16, 2),
  missingReferences: array(object({ from: text, target: text }), 16),
  cycleMembers: array(text, 16),
  validReferences: boolean,
  pretty: text,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is JsonReferenceIntegrityFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonReferenceIntegrityFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonReferenceIntegrityFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(input.ids, "ids");
    const random = createGeneratorRandom(input.seed, context),
      remaining = [...input.ids],
      ids: string[] = [];
    while (remaining.length) {
      const id = pick(remaining, random);
      ids.push(id);
      remaining.splice(remaining.indexOf(id), 1);
    }
    let missing = "__missing__";
    while (input.ids.includes(missing)) missing += "_";
    const records = ids.map((id, i) => ({
        id,
        next:
          i < ids.length - 1
            ? (ids[i + 1] ?? null)
            : input.mode === "cycle"
              ? (ids[0] ?? null)
              : input.mode === "missing"
                ? missing
                : null,
      })),
      byId = new Map(records.map((r) => [r.id, r.next])),
      missingReferences = records
        .filter((r) => r.next !== null && !byId.has(r.next))
        .map((r) => ({ from: r.id, target: r.next ?? "" })),
      members = new Set<string>();
    for (const record of records) {
      const path: string[] = [],
        seen = new Map<string, number>();
      let node: string | null = record.id;
      while (node !== null && byId.has(node)) {
        const at = seen.get(node);
        if (at !== undefined) {
          path.slice(at).forEach((n) => members.add(n));
          break;
        }
        seen.set(node, path.length);
        path.push(node);
        node = byId.get(node) ?? null;
      }
    }
    return toolSuccess({
      records,
      missingReferences,
      cycleMembers: ids.filter((id) => members.has(id)),
      validReferences: missingReferences.length === 0,
      pretty: pretty(records),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonReferenceIntegrityFixtureExample = {
  input: { ids: ["a", "b", "c"], mode: "cycle", seed: 42 },
  output: {
    records: [
      { id: "b", next: "a" },
      { id: "a", next: "c" },
      { id: "c", next: "b" },
    ],
    missingReferences: [],
    cycleMembers: ["b", "a", "c"],
    validReferences: true,
    pretty:
      '[\n  {\n    "id": "b",\n    "next": "a"\n  },\n  {\n    "id": "a",\n    "next": "c"\n  },\n  {\n    "id": "c",\n    "next": "b"\n  }\n]\n',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonReferenceIntegrityFixtureInput,
  JsonReferenceIntegrityFixtureOutput
>;
export const jsonReferenceIntegrityFixtureTool = createModelDefinition<
  JsonReferenceIntegrityFixtureInput,
  JsonReferenceIntegrityFixtureOutput
>({
  id: "random/json-reference-integrity-fixture",
  title: "Random JSON Reference Integrity Fixture Generator",
  description:
    "Construct bounded linked records with chain, dangling-reference or cycle controls and retain independently traceable reference and cycle labels.",
  inputSchema,
  outputSchema,
  execute: calculateJsonReferenceIntegrityFixture,
});
export const runJsonReferenceIntegrityFixture =
  jsonReferenceIntegrityFixtureTool.execute;
export default jsonReferenceIntegrityFixtureTool;
