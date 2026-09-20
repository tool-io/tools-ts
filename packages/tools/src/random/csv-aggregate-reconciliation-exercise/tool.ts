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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateSumAggregatePerNumericColumn } from "../../csv/sum-aggregate-per-numeric-column/tool.js";
import { calculateChecksumTotalRowAppender } from "../../csv/checksum-total-row-appender/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  integerSchema,
  countSchema,
  ordered,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import { csvTextSchema, csvText } from "../m500b-csv-algorithms-csv.js";

export type CsvAggregateReconciliationExerciseInput = {
  readonly groupCount: number;
  readonly rowsPerGroup: number;
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly discrepancy: number;
  readonly seed?: number;
};
export type CsvAggregateReconciliationExerciseOutput = {
  readonly rows: readonly { readonly group: string; readonly value: number }[];
  readonly subtotals: readonly {
    readonly group: string;
    readonly correct: string;
    readonly reported: string;
    readonly discrepancy: string;
  }[];
  readonly changedGroup: number;
  readonly correctGrandTotal: string;
  readonly reportedGrandTotal: string;
  readonly answerCsv: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    groupCount: countSchema(8, 1),
    rowsPerGroup: countSchema(8, 1),
    minimumValue: integerSchema,
    maximumValue: integerSchema,
    discrepancy: integerSchema,
    seed: generatorSeedSchema,
  },
  ["groupCount", "rowsPerGroup", "minimumValue", "maximumValue", "discrepancy"],
);
export const outputSchema = objectSchema({
  rows: arraySchema(
    objectSchema({ group: textSchema, value: integerSchema }),
    64,
  ),
  subtotals: arraySchema(
    objectSchema({
      group: textSchema,
      correct: textSchema,
      reported: textSchema,
      discrepancy: textSchema,
    }),
    8,
  ),
  changedGroup: countSchema(7),
  correctGrandTotal: textSchema,
  reportedGrandTotal: textSchema,
  answerCsv: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is CsvAggregateReconciliationExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvAggregateReconciliationExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvAggregateReconciliationExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    ordered(input.minimumValue, input.maximumValue);
    const random = createGeneratorRandom(input.seed, context),
      rows = Array.from(
        { length: input.groupCount * input.rowsPerGroup },
        (_, index) => ({
          group: "G" + (Math.floor(index / input.rowsPerGroup) + 1),
          value: random.integer(input.minimumValue, input.maximumValue),
        }),
      );
    const changedGroup = random.integer(0, input.groupCount - 1);
    const sum = (
      selected: readonly { readonly group: string; readonly value: number }[],
    ): string => {
      const columns = coreOutput(
        calculateSumAggregatePerNumericColumn({
          csv: csvText([
            ["group", "value"],
            ...selected.map((row) => [row.group, String(row.value)]),
          ]),
          delimiter: ",",
          hasHeader: true,
          columnIndices: [1],
        }),
      ).columns;
      const result = columns[0];
      if (!result) throw new Error("Requested total missing.");
      return result.sum;
    };
    const subtotals = Array.from({ length: input.groupCount }, (_, index) => {
      const group = "G" + (index + 1),
        correct = sum(rows.filter((row) => row.group === group)),
        discrepancy = index === changedGroup ? BigInt(input.discrepancy) : 0n;
      return {
        group,
        correct,
        reported: String(BigInt(correct) + discrepancy),
        discrepancy: String(discrepancy),
      };
    });
    const correctGrandTotal = sum(rows),
      reportedGrandTotal = String(
        subtotals.reduce((total, group) => total + BigInt(group.reported), 0n),
      );
    const answerCsv = coreOutput(
      calculateChecksumTotalRowAppender({
        csv: csvText([
          ["group", "value"],
          ...rows.map((row) => [row.group, String(row.value)]),
        ]),
        delimiter: ",",
        hasHeader: true,
        columnIndices: [1],
        labelColumn: 0,
        label: "Grand",
      }),
    ).csv;
    return toolSuccess({
      rows,
      subtotals,
      changedGroup,
      correctGrandTotal,
      reportedGrandTotal,
      answerCsv,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvAggregateReconciliationExerciseExample = {
  input: {
    groupCount: 2,
    rowsPerGroup: 1,
    minimumValue: 1,
    maximumValue: 9,
    discrepancy: 2,
    seed: 42,
  },
  output: {
    rows: [
      { group: "G1", value: 6 },
      { group: "G2", value: 5 },
    ],
    subtotals: [
      { group: "G1", correct: "6", reported: "6", discrepancy: "0" },
      { group: "G2", correct: "5", reported: "7", discrepancy: "2" },
    ],
    changedGroup: 1,
    correctGrandTotal: "11",
    reportedGrandTotal: "13",
    answerCsv: "group,value\nG1,6\nG2,5\nGrand,11",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvAggregateReconciliationExerciseInput,
  CsvAggregateReconciliationExerciseOutput
>;
export const csvAggregateReconciliationExerciseTool = createModelDefinition<
  CsvAggregateReconciliationExerciseInput,
  CsvAggregateReconciliationExerciseOutput
>({
  id: "random/csv-aggregate-reconciliation-exercise",
  title: "Random CSV Aggregate Reconciliation Exercise Generator",
  description:
    "Generate synthetic grouped integer observations, plant one declared subtotal discrepancy and retain exact decimal-string subtotal, grand-total and checksum-row reconciliation answers.",
  inputSchema,
  outputSchema,
  execute: calculateCsvAggregateReconciliationExercise,
});
export const runCsvAggregateReconciliationExercise =
  csvAggregateReconciliationExerciseTool.execute;
export default csvAggregateReconciliationExerciseTool;
