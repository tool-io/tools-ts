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
import { calculateExcelSerialDateToIsoConverter } from "../../csv/excel-serial-date-to-iso-converter/tool.js";
import { calculateIsoDateToExcelSerialExport } from "../../csv/iso-date-to-excel-serial-export/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  integerSchema,
  countSchema,
  nullableSchema,
  enumSchema,
  ordered,
  safeInteger,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";

export type SpreadsheetSerialDateBoundaryCorpusInput = {
  readonly system: "1900" | "1904";
  readonly startSerial: number;
  readonly radius: number;
  readonly count: number;
  readonly seed?: number;
};
export type SpreadsheetSerialDateBoundaryCorpusOutput = {
  readonly system: "1900" | "1904";
  readonly cases: readonly {
    readonly serial: number;
    readonly isoDate: string | null;
    readonly errorCode: string | null;
    readonly roundTripSerial: number | null;
  }[];
  readonly randomness: GeneratorReplay;
};
const systemSchema = enumSchema(["1900", "1904"]);
export const inputSchema = objectSchema(
  {
    system: systemSchema,
    startSerial: integerSchema,
    radius: countSchema(8),
    count: countSchema(16, 1),
    seed: generatorSeedSchema,
  },
  ["system", "startSerial", "radius", "count"],
);
export const outputSchema = objectSchema({
  system: systemSchema,
  cases: arraySchema(
    objectSchema({
      serial: integerSchema,
      isoDate: nullableSchema(textSchema),
      errorCode: nullableSchema(textSchema),
      roundTripSerial: nullableSchema(integerSchema),
    }),
    16,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is SpreadsheetSerialDateBoundaryCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateSpreadsheetSerialDateBoundaryCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SpreadsheetSerialDateBoundaryCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const minimum = safeInteger(
        BigInt(input.startSerial) - BigInt(input.radius),
        "startSerial",
      ),
      maximum = safeInteger(
        BigInt(input.startSerial) + BigInt(input.radius),
        "startSerial",
      );
    ordered(minimum, maximum, "startSerial");
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from(
        { length: input.count },
        (): SpreadsheetSerialDateBoundaryCorpusOutput["cases"][number] => {
          const serial = random.integer(minimum, maximum);
          // The old converter rejects negative serials structurally; label them with the same date-range convention.
          if (serial < 0)
            return {
              serial,
              isoDate: null,
              errorCode: "date_range",
              roundTripSerial: null,
            };
          const converted = calculateExcelSerialDateToIsoConverter({
            serial,
            system: input.system,
          });
          if (!converted.ok) {
            const issue = converted.error.issues[0];
            if (
              !issue ||
              !["date_range", "fictitious_date"].includes(issue.code)
            )
              throw new Error("Unexpected serial-date failure.");
            return {
              serial,
              isoDate: null,
              errorCode: issue.code,
              roundTripSerial: null,
            };
          }
          return {
            serial,
            isoDate: converted.output.isoDate,
            errorCode: null,
            roundTripSerial: coreOutput(
              calculateIsoDateToExcelSerialExport({
                isoDate: converted.output.isoDate,
                system: input.system,
              }),
            ).serial,
          };
        },
      );
    return toolSuccess({
      system: input.system,
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const spreadsheetSerialDateBoundaryCorpusExample = {
  input: { system: "1900", startSerial: 60, radius: 1, count: 3, seed: 42 },
  output: {
    system: "1900",
    cases: [
      {
        serial: 60,
        isoDate: null,
        errorCode: "fictitious_date",
        roundTripSerial: null,
      },
      {
        serial: 60,
        isoDate: null,
        errorCode: "fictitious_date",
        roundTripSerial: null,
      },
      {
        serial: 61,
        isoDate: "1900-03-01",
        errorCode: null,
        roundTripSerial: 61,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SpreadsheetSerialDateBoundaryCorpusInput,
  SpreadsheetSerialDateBoundaryCorpusOutput
>;
export const spreadsheetSerialDateBoundaryCorpusTool = createModelDefinition<
  SpreadsheetSerialDateBoundaryCorpusInput,
  SpreadsheetSerialDateBoundaryCorpusOutput
>({
  id: "random/spreadsheet-serial-date-boundary-corpus",
  title: "Random Spreadsheet Serial Date Boundary Corpus Generator",
  description:
    "Sample integer serial dates around a caller boundary in the explicit 1900 or 1904 workbook system, retaining date-range and fictitious-day controls plus successful reverse conversions.",
  inputSchema,
  outputSchema,
  execute: calculateSpreadsheetSerialDateBoundaryCorpus,
});
export const runSpreadsheetSerialDateBoundaryCorpus =
  spreadsheetSerialDateBoundaryCorpusTool.execute;
export default spreadsheetSerialDateBoundaryCorpusTool;
