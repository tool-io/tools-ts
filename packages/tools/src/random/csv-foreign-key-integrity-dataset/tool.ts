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
  generatorSampleIndices,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateForeignKeyColumnPairMatchRate } from "../../csv/foreign-key-column-pair-match-rate/tool.js";
import { calculateOrphanRowsParentKeyMissingFinder } from "../../csv/orphan-rows-parent-key-missing-finder/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  booleanSchema,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  csvTextSchema,
  csvItem,
  csvText,
} from "../m500b-csv-algorithms-csv.js";

export type CsvForeignKeyIntegrityDatasetInput = {
  readonly parentCount: number;
  readonly childCount: number;
  readonly orphanCount: number;
  readonly seed?: number;
};
type Child = {
  readonly id: string;
  readonly parentKey: string;
  readonly orphan: boolean;
};
export type CsvForeignKeyIntegrityDatasetOutput = {
  readonly parents: readonly string[];
  readonly children: readonly Child[];
  readonly orphanIndices: readonly number[];
  readonly matchRate: number;
  readonly parentCsv: string;
  readonly childCsv: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    parentCount: countSchema(16, 1),
    childCount: countSchema(32, 1),
    orphanCount: countSchema(32),
    seed: generatorSeedSchema,
  },
  ["parentCount", "childCount", "orphanCount"],
);
export const outputSchema = objectSchema({
  parents: arraySchema(textSchema, 16),
  children: arraySchema(
    objectSchema({
      id: textSchema,
      parentKey: textSchema,
      orphan: booleanSchema,
    }),
    32,
  ),
  orphanIndices: arraySchema(countSchema(31), 32),
  matchRate: { type: "number", minimum: 0, maximum: 1 },
  parentCsv: csvTextSchema,
  childCsv: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvForeignKeyIntegrityDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvForeignKeyIntegrityDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvForeignKeyIntegrityDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.orphanCount > input.childCount)
      return simpleError(
        "orphanCount",
        "Orphan count cannot exceed child count.",
        "infeasible_orphan_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      parents = Array.from(
        { length: input.parentCount },
        (_, index) => "P" + (index + 1),
      );
    const orphanSet = new Set(
      generatorSampleIndices(input.childCount, input.orphanCount, random),
    );
    const children = Array.from({ length: input.childCount }, (_, index) => ({
      id: "C" + (index + 1),
      parentKey: orphanSet.has(index)
        ? "X" + (index + 1)
        : csvItem(parents, random),
      orphan: orphanSet.has(index),
    }));
    const parentCsv = csvText([["parent"], ...parents.map((key) => [key])]),
      childCsv = csvText([
        ["child", "parent"],
        ...children.map((child) => [child.id, child.parentKey]),
      ]);
    const match = coreOutput(
      calculateForeignKeyColumnPairMatchRate({
        parentKeys: parents,
        childKeys: children.map((child) => child.parentKey),
      }),
    );
    const orphanIndices = coreOutput(
      calculateOrphanRowsParentKeyMissingFinder({
        csv: childCsv,
        delimiter: ",",
        hasHeader: true,
        column: 1,
        parentKeys: parents,
      }),
    ).recordIndices.map((index) => index - 1);
    return toolSuccess({
      parents,
      children,
      orphanIndices,
      matchRate: match.matchRate,
      parentCsv,
      childCsv,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvForeignKeyIntegrityDatasetExample = {
  input: { parentCount: 2, childCount: 3, orphanCount: 1, seed: 42 },
  output: {
    parents: ["P1", "P2"],
    children: [
      { id: "C1", parentKey: "P1", orphan: false },
      { id: "C2", parentKey: "X2", orphan: true },
      { id: "C3", parentKey: "P2", orphan: false },
    ],
    orphanIndices: [1],
    matchRate: 0.6666666666666666,
    parentCsv: "parent\nP1\nP2",
    childCsv: "child,parent\nC1,P1\nC2,X2\nC3,P2",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvForeignKeyIntegrityDatasetInput,
  CsvForeignKeyIntegrityDatasetOutput
>;
export const csvForeignKeyIntegrityDatasetTool = createModelDefinition<
  CsvForeignKeyIntegrityDatasetInput,
  CsvForeignKeyIntegrityDatasetOutput
>({
  id: "random/csv-foreign-key-integrity-dataset",
  title: "Random CSV Foreign Key Integrity Dataset Generator",
  description:
    "Construct synthetic parent and child tables with an exact sampled orphan count, retaining reference truth, core match rate and orphan data-row indices.",
  inputSchema,
  outputSchema,
  execute: calculateCsvForeignKeyIntegrityDataset,
});
export const runCsvForeignKeyIntegrityDataset =
  csvForeignKeyIntegrityDatasetTool.execute;
export default csvForeignKeyIntegrityDatasetTool;
