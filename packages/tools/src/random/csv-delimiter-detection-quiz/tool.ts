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
import {
  calculateDelimiterSnifferCommaSemicolonTab,
  delimiterSnifferCommaSemicolonTabOutputSchema,
  type DelimiterSnifferCommaSemicolonTabOutput,
} from "../../csv/delimiter-sniffer-comma-semicolon-tab/tool.js";
import {
  arraySchema,
  objectSchema,
  booleanSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  rowsSchema,
  csvTextSchema,
  delimiterSchema,
  rectangular,
  csvItem,
  csvText,
  type CsvRows,
} from "../m500b-csv-algorithms-csv.js";

export type CsvDelimiterDetectionQuizInput = {
  readonly rows: CsvRows;
  readonly delimiters: readonly ("," | ";" | "\t")[];
  readonly quoteAll: boolean;
  readonly includeAmbiguous: boolean;
  readonly seed?: number;
};
export type CsvDelimiterDetectionQuizOutput = {
  readonly cases: readonly {
    readonly csv: string;
    readonly sourceDelimiter: string;
    readonly singleColumnControl: boolean;
    readonly detection: DelimiterSnifferCommaSemicolonTabOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    rows: rowsSchema,
    delimiters: arraySchema(delimiterSchema, 3, 1),
    quoteAll: booleanSchema,
    includeAmbiguous: booleanSchema,
    seed: generatorSeedSchema,
  },
  ["rows", "delimiters", "quoteAll", "includeAmbiguous"],
);
export const outputSchema = objectSchema({
  cases: arraySchema(
    objectSchema({
      csv: csvTextSchema,
      sourceDelimiter: delimiterSchema,
      singleColumnControl: booleanSchema,
      detection: delimiterSnifferCommaSemicolonTabOutputSchema,
    }),
    2,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvDelimiterDetectionQuizInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvDelimiterDetectionQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvDelimiterDetectionQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    rectangular(input.rows);
    distinct(input.delimiters, "delimiters");
    const random = createGeneratorRandom(input.seed, context),
      sourceDelimiter = csvItem(input.delimiters, random);
    const makeCase = (rows: CsvRows, singleColumnControl: boolean) => {
      // Quote the whole control column so embedded alternative delimiters cannot make it informative.
      const csv = csvText(
        rows,
        sourceDelimiter,
        singleColumnControl || input.quoteAll,
      );
      return {
        csv,
        sourceDelimiter,
        singleColumnControl,
        detection: coreOutput(
          calculateDelimiterSnifferCommaSemicolonTab({ csv }),
        ),
      };
    };
    const cases = [makeCase(input.rows, false)];
    if (input.includeAmbiguous)
      cases.push(
        makeCase(
          input.rows.map((row) => [row[0] ?? ""]),
          true,
        ),
      );
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvDelimiterDetectionQuizExample = {
  input: {
    rows: [
      ["a", "b"],
      ["c", "d"],
    ],
    delimiters: [",", ";"],
    quoteAll: false,
    includeAmbiguous: true,
    seed: 42,
  },
  output: {
    cases: [
      {
        csv: "a;b\nc;d",
        sourceDelimiter: ";",
        singleColumnControl: false,
        detection: {
          delimiter: ";",
          ambiguous: false,
          candidates: [
            {
              delimiter: ";",
              modalWidth: 2,
              matchingRecords: 2,
              recordCount: 2,
            },
          ],
        },
      },
      {
        csv: '"a"\n"c"',
        sourceDelimiter: ";",
        singleColumnControl: true,
        detection: { delimiter: "", ambiguous: true, candidates: [] },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvDelimiterDetectionQuizInput,
  CsvDelimiterDetectionQuizOutput
>;
export const csvDelimiterDetectionQuizTool = createModelDefinition<
  CsvDelimiterDetectionQuizInput,
  CsvDelimiterDetectionQuizOutput
>({
  id: "random/csv-delimiter-detection-quiz",
  title: "Random CSV Delimiter Detection Quiz Generator",
  description:
    "Serialize a supplied table using a sampled dialect and quoting policy, retaining actual sniffer ambiguity and an optional guaranteed single-column ambiguous control.",
  inputSchema,
  outputSchema,
  execute: calculateCsvDelimiterDetectionQuiz,
});
export const runCsvDelimiterDetectionQuiz =
  csvDelimiterDetectionQuizTool.execute;
export default csvDelimiterDetectionQuizTool;
