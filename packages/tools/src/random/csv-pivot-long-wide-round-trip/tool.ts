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
import { calculateJsonToCsv } from "../../convert/json-to-csv/tool.js";
import { calculateCsvToJson } from "../../convert/csv-to-json/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  integerSchema,
  countSchema,
  enumSchema,
  distinct,
} from "../m500b-csv-algorithms-schemas.js";
import { csvTextSchema, csvItem } from "../m500b-csv-algorithms-csv.js";

type LongRow = {
  readonly entity: string;
  readonly measure: string;
  readonly value: number;
};
export type CsvPivotLongWideRoundTripInput = {
  readonly entities: readonly string[];
  readonly measures: readonly string[];
  readonly duplicateCount: number;
  readonly aggregation: "sum";
  readonly seed?: number;
};
export type CsvPivotLongWideRoundTripOutput = {
  readonly longRows: readonly LongRow[];
  readonly wideRows: readonly {
    readonly entity: string;
    readonly values: readonly number[];
  }[];
  readonly aggregatedLongRows: readonly LongRow[];
  readonly longCsv: string;
  readonly wideCsv: string;
  readonly parsedLongJson: string;
  readonly randomness: GeneratorReplay;
};
const longRowSchema = objectSchema({
  entity: textSchema,
  measure: textSchema,
  value: integerSchema,
});
export const inputSchema = objectSchema(
  {
    entities: arraySchema({ ...textSchema, minLength: 1 }, 8, 1),
    measures: arraySchema({ ...textSchema, minLength: 1 }, 8, 1),
    duplicateCount: countSchema(32),
    aggregation: enumSchema(["sum"]),
    seed: generatorSeedSchema,
  },
  ["entities", "measures", "duplicateCount", "aggregation"],
);
export const outputSchema = objectSchema({
  longRows: arraySchema(longRowSchema, 96),
  wideRows: arraySchema(
    objectSchema({ entity: textSchema, values: arraySchema(integerSchema, 8) }),
    8,
  ),
  aggregatedLongRows: arraySchema(longRowSchema, 64),
  longCsv: csvTextSchema,
  wideCsv: csvTextSchema,
  parsedLongJson: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvPivotLongWideRoundTripInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvPivotLongWideRoundTrip = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvPivotLongWideRoundTripOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.entities, "entities");
    distinct(input.measures, "measures");
    if (
      input.entities.length * input.measures.length + input.duplicateCount >
      96
    )
      return simpleError(
        "duplicateCount",
        "Long output is limited to 96 rows.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      longRows: LongRow[] = input.entities.flatMap((entity) =>
        input.measures.map((measure) => ({
          entity,
          measure,
          value: random.integer(1, 9),
        })),
      );
    const baseline = [...longRows];
    for (let index = 0; index < input.duplicateCount; index += 1) {
      const source = csvItem(baseline, random);
      longRows.push({
        entity: source.entity,
        measure: source.measure,
        value: random.integer(1, 9),
      });
    }
    const sums = new Map<string, number>();
    for (const row of longRows) {
      const key = JSON.stringify([row.entity, row.measure]);
      sums.set(key, (sums.get(key) ?? 0) + row.value);
    }
    const wideRows = input.entities.map((entity) => ({
      entity,
      values: input.measures.map(
        (measure) => sums.get(JSON.stringify([entity, measure])) ?? 0,
      ),
    }));
    const aggregatedLongRows = wideRows.flatMap((row) =>
      input.measures.map((measure, column) => ({
        entity: row.entity,
        measure,
        value: row.values[column] ?? 0,
      })),
    );
    const longCsv = calculateJsonToCsv({ json: JSON.stringify(longRows) }).csv;
    const wideCsv = calculateJsonToCsv({
      json: JSON.stringify(
        wideRows.map((row) =>
          Object.fromEntries([
            ["entity", row.entity],
            ...row.values.map((value, index) => ["m" + index, value]),
          ]),
        ),
      ),
    }).csv;
    return toolSuccess({
      longRows,
      wideRows,
      aggregatedLongRows,
      longCsv,
      wideCsv,
      parsedLongJson: calculateCsvToJson({ csv: longCsv, inferNumbers: false })
        .json,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvPivotLongWideRoundTripExample = {
  input: {
    entities: ["A"],
    measures: ["x", "y"],
    duplicateCount: 1,
    aggregation: "sum",
    seed: 42,
  },
  output: {
    longRows: [
      { entity: "A", measure: "x", value: 6 },
      { entity: "A", measure: "y", value: 5 },
      { entity: "A", measure: "y", value: 7 },
    ],
    wideRows: [{ entity: "A", values: [6, 12] }],
    aggregatedLongRows: [
      { entity: "A", measure: "x", value: 6 },
      { entity: "A", measure: "y", value: 12 },
    ],
    longCsv: "entity,measure,value\nA,x,6\nA,y,5\nA,y,7\n",
    wideCsv: "entity,m0,m1\nA,6,12\n",
    parsedLongJson:
      '[{"entity":"A","measure":"x","value":"6"},{"entity":"A","measure":"y","value":"5"},{"entity":"A","measure":"y","value":"7"}]',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvPivotLongWideRoundTripInput,
  CsvPivotLongWideRoundTripOutput
>;
export const csvPivotLongWideRoundTripTool = createModelDefinition<
  CsvPivotLongWideRoundTripInput,
  CsvPivotLongWideRoundTripOutput
>({
  id: "random/csv-pivot-long-wide-round-trip",
  title: "Random CSV Long and Wide Round-Trip Fixture Generator",
  description:
    "Construct a complete entity/measure grid with planted duplicate observations, explicitly sum duplicates, reshape to fixed-header wide CSV and unpivot the aggregate answer using reviewed CSV converters.",
  inputSchema,
  outputSchema,
  execute: calculateCsvPivotLongWideRoundTrip,
});
export const runCsvPivotLongWideRoundTrip =
  csvPivotLongWideRoundTripTool.execute;
export default csvPivotLongWideRoundTripTool;
