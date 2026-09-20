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
import { isoDateMillis } from "../../csv/excel-serial-date-to-iso-converter/tool.js";
import { calculateDateFormatDetectionFromColumnSample } from "../../csv/date-format-detection-from-column-sample/tool.js";
import {
  arraySchema,
  objectSchema,
  enumSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import { csvItem } from "../m500b-csv-algorithms-csv.js";

type DateSpelling = "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY";
export type CsvDateColumnCleaningExerciseInput = {
  readonly isoDates: readonly string[];
  readonly formats: readonly DateSpelling[];
  readonly seed?: number;
};
export type CsvDateColumnCleaningExerciseOutput = {
  readonly calendar: "proleptic-Gregorian-four-digit-year";
  readonly cells: readonly {
    readonly token: string;
    readonly iso: string;
    readonly format: DateSpelling;
    readonly compatibleFormats: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
const isoSchema = {
  type: "string",
  minLength: 10,
  maxLength: 10,
  pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}(?![\\s\\S])",
} as const;
const formatSchema = enumSchema(["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]);
export const inputSchema = objectSchema(
  {
    isoDates: arraySchema(isoSchema, 32, 1),
    formats: arraySchema(formatSchema, 3, 1),
    seed: generatorSeedSchema,
  },
  ["isoDates", "formats"],
);
export const outputSchema = objectSchema({
  calendar: enumSchema(["proleptic-Gregorian-four-digit-year"]),
  cells: arraySchema(
    objectSchema({
      token: { type: "string", minLength: 10, maxLength: 10 },
      iso: isoSchema,
      format: formatSchema,
      compatibleFormats: arraySchema(formatSchema, 3),
    }),
    32,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvDateColumnCleaningExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvDateColumnCleaningExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvDateColumnCleaningExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.formats, "formats");
    input.isoDates.forEach((iso, index) => {
      if (isoDateMillis(iso) === undefined)
        simpleError(
          "isoDates." + index,
          "Supply a real Gregorian date in years 0001 through 9999.",
          "invalid_date",
        );
    });
    const random = createGeneratorRandom(input.seed, context),
      cells = input.isoDates.map((iso) => {
        const format = csvItem(input.formats, random),
          year = iso.slice(0, 4),
          month = iso.slice(5, 7),
          day = iso.slice(8, 10);
        const token =
          format === "YYYY-MM-DD"
            ? iso
            : format === "DD/MM/YYYY"
              ? day + "/" + month + "/" + year
              : month + "/" + day + "/" + year;
        return {
          token,
          iso,
          format,
          compatibleFormats: coreOutput(
            calculateDateFormatDetectionFromColumnSample({ values: [token] }),
          ).formats,
        };
      });
    return toolSuccess({
      calendar: "proleptic-Gregorian-four-digit-year",
      cells,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvDateColumnCleaningExerciseExample = {
  input: {
    isoDates: ["2024-02-29", "2024-12-31", "2025-01-03"],
    formats: ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"],
    seed: 42,
  },
  output: {
    calendar: "proleptic-Gregorian-four-digit-year",
    cells: [
      {
        token: "29/02/2024",
        iso: "2024-02-29",
        format: "DD/MM/YYYY",
        compatibleFormats: ["DD/MM/YYYY"],
      },
      {
        token: "31/12/2024",
        iso: "2024-12-31",
        format: "DD/MM/YYYY",
        compatibleFormats: ["DD/MM/YYYY"],
      },
      {
        token: "01/03/2025",
        iso: "2025-01-03",
        format: "MM/DD/YYYY",
        compatibleFormats: ["MM/DD/YYYY", "DD/MM/YYYY"],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvDateColumnCleaningExerciseInput,
  CsvDateColumnCleaningExerciseOutput
>;
export const csvDateColumnCleaningExerciseTool = createModelDefinition<
  CsvDateColumnCleaningExerciseInput,
  CsvDateColumnCleaningExerciseOutput
>({
  id: "random/csv-date-column-cleaning-exercise",
  title: "Random CSV Date Column Cleaning Exercise Generator",
  description:
    "Spell supplied Gregorian ISO dates using sampled supported four-digit-year formats, retaining the declared ISO answer and every compatible detector interpretation for ambiguous slash dates.",
  inputSchema,
  outputSchema,
  execute: calculateCsvDateColumnCleaningExercise,
});
export const runCsvDateColumnCleaningExercise =
  csvDateColumnCleaningExerciseTool.execute;
export default csvDateColumnCleaningExerciseTool;
