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
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type JsonDuplicateIdDatasetInput = {
  readonly ids: readonly string[];
  readonly duplicateCount: number;
  readonly missingControl: boolean;
  readonly seed?: number;
};
export type JsonDuplicateIdDatasetOutput = {
  readonly records: readonly { readonly id: string; readonly ref: string }[];
  readonly references: readonly {
    readonly recordIndex: number;
    readonly target: string;
    readonly candidates: readonly number[];
    readonly status: "missing" | "unique" | "ambiguous";
  }[];
  readonly duplicateCount: number;
  readonly duplicateRate: number;
  readonly pretty: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    ids: array(label, 16, 1),
    duplicateCount: bounded(0, 16),
    missingControl: boolean,
    seed: generatorSeedSchema,
  },
  ["ids", "duplicateCount", "missingControl"],
);
export const outputSchema = object({
  records: array(object({ id: text, ref: text }), 32, 1),
  references: array(
    object({
      recordIndex: bounded(0, 31),
      target: text,
      candidates: array(bounded(0, 31), 32),
      status: choice(["missing", "unique", "ambiguous"]),
    }),
    32,
  ),
  duplicateCount: bounded(0, 16),
  duplicateRate: { type: "number", minimum: 0, maximum: 1 },
  pretty: text,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is JsonDuplicateIdDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonDuplicateIdDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonDuplicateIdDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(input.ids, "ids");
    const random = createGeneratorRandom(input.seed, context),
      ids = [
        ...input.ids,
        ...Array.from({ length: input.duplicateCount }, () =>
          pick(input.ids, random),
        ),
      ];
    let missing = "__missing__";
    while (ids.includes(missing)) missing += "_";
    const records = ids.map((id, i) => ({
      id,
      ref:
        input.missingControl && i === ids.length - 1
          ? missing
          : pick(ids, random),
    }));
    const references = records.map(
      (r, recordIndex): JsonDuplicateIdDatasetOutput["references"][number] => {
        const candidates = ids.flatMap((id, i) => (id === r.ref ? [i] : []));
        return {
          recordIndex,
          target: r.ref,
          candidates,
          status:
            candidates.length === 0
              ? "missing"
              : candidates.length === 1
                ? "unique"
                : "ambiguous",
        };
      },
    );
    return toolSuccess({
      records,
      references,
      duplicateCount: input.duplicateCount,
      duplicateRate: input.duplicateCount / ids.length,
      pretty: pretty(records),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonDuplicateIdDatasetExample = {
  input: {
    ids: ["a", "b"],
    duplicateCount: 1,
    missingControl: false,
    seed: 42,
  },
  output: {
    records: [
      { id: "a", ref: "b" },
      { id: "b", ref: "b" },
      { id: "b", ref: "b" },
    ],
    references: [
      { recordIndex: 0, target: "b", candidates: [1, 2], status: "ambiguous" },
      { recordIndex: 1, target: "b", candidates: [1, 2], status: "ambiguous" },
      { recordIndex: 2, target: "b", candidates: [1, 2], status: "ambiguous" },
    ],
    duplicateCount: 1,
    duplicateRate: 0.3333333333333333,
    pretty:
      '[\n  {\n    "id": "a",\n    "ref": "b"\n  },\n  {\n    "id": "b",\n    "ref": "b"\n  },\n  {\n    "id": "b",\n    "ref": "b"\n  }\n]\n',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonDuplicateIdDatasetInput,
  JsonDuplicateIdDatasetOutput
>;
export const jsonDuplicateIdDatasetTool = createModelDefinition<
  JsonDuplicateIdDatasetInput,
  JsonDuplicateIdDatasetOutput
>({
  id: "random/json-duplicate-id-dataset",
  title: "Random JSON Duplicate ID Dataset Generator",
  description:
    "Construct linked records with an exact duplicate insertion count and retain missing, unique and ambiguous reference candidate indices.",
  inputSchema,
  outputSchema,
  execute: calculateJsonDuplicateIdDataset,
});
export const runJsonDuplicateIdDataset = jsonDuplicateIdDatasetTool.execute;
export default jsonDuplicateIdDatasetTool;
