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
import { calculateLeadingZeroZipCodeLossWarner } from "../../csv/leading-zero-zip-code-loss-warner/tool.js";
import { calculateCsvToJson } from "../../convert/csv-to-json/tool.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import { csvTextSchema, csvText } from "../m500b-csv-algorithms-csv.js";

export type CsvLeadingZeroPreservationFixtureInput = {
  readonly count: number;
  readonly width: number;
  readonly seed?: number;
};
export type CsvLeadingZeroPreservationFixtureOutput = {
  readonly codes: readonly string[];
  readonly csv: string;
  readonly textImportJson: string;
  readonly numericImportJson: string;
  readonly zipShapedRiskIndices: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    count: countSchema(32, 1),
    width: countSchema(12, 2),
    seed: generatorSeedSchema,
  },
  ["count", "width"],
);
export const outputSchema = objectSchema({
  codes: arraySchema(
    {
      type: "string",
      minLength: 2,
      maxLength: 12,
      pattern: "^0[0-9]+(?![\\s\\S])",
    },
    32,
  ),
  csv: csvTextSchema,
  textImportJson: csvTextSchema,
  numericImportJson: csvTextSchema,
  zipShapedRiskIndices: arraySchema(countSchema(31), 32),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is CsvLeadingZeroPreservationFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvLeadingZeroPreservationFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvLeadingZeroPreservationFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      maximum = 10 ** (input.width - 1) - 1;
    const codes = Array.from({ length: input.count }, () =>
      String(random.integer(1, maximum)).padStart(input.width, "0"),
    );
    const csv = csvText([["code"], ...codes.map((code) => [code])]);
    return toolSuccess({
      codes,
      csv,
      textImportJson: calculateCsvToJson({ csv, inferNumbers: false }).json,
      numericImportJson: calculateCsvToJson({ csv, inferNumbers: true }).json,
      zipShapedRiskIndices: coreOutput(
        calculateLeadingZeroZipCodeLossWarner({ values: codes }),
      ).atRiskIndices,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvLeadingZeroPreservationFixtureExample = {
  input: { count: 2, width: 5, seed: 42 },
  output: {
    codes: ["06011", "04483"],
    csv: "code\n06011\n04483",
    textImportJson: '[{"code":"06011"},{"code":"04483"}]',
    numericImportJson: '[{"code":6011},{"code":4483}]',
    zipShapedRiskIndices: [0, 1],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvLeadingZeroPreservationFixtureInput,
  CsvLeadingZeroPreservationFixtureOutput
>;
export const csvLeadingZeroPreservationFixtureTool = createModelDefinition<
  CsvLeadingZeroPreservationFixtureInput,
  CsvLeadingZeroPreservationFixtureOutput
>({
  id: "random/csv-leading-zero-preservation-fixture",
  title: "Random CSV Leading Zero Preservation Fixture Generator",
  description:
    "Generate synthetic leading-zero code strings and compare explicit text and destructive numeric import options, retaining the narrower ZIP-shaped lexical warning without postal validity claims.",
  inputSchema,
  outputSchema,
  execute: calculateCsvLeadingZeroPreservationFixture,
});
export const runCsvLeadingZeroPreservationFixture =
  csvLeadingZeroPreservationFixtureTool.execute;
export default csvLeadingZeroPreservationFixtureTool;
