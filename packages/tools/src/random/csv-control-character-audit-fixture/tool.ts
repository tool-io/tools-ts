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
  calculateControlCharacterFinderInFields,
  controlCharacterFinderInFieldsOutputSchema,
  type ControlCharacterFinderInFieldsOutput,
} from "../../csv/control-character-finder-in-fields/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import { csvItem } from "../m500b-csv-algorithms-csv.js";

export type CsvControlCharacterAuditFixtureInput = {
  readonly fragments: readonly string[];
  readonly codePoints: readonly (9 | 10 | 13 | 127 | 133)[];
  readonly count: number;
  readonly seed?: number;
};
export type CsvControlCharacterAuditFixtureOutput = {
  readonly cases: readonly {
    readonly original: string;
    readonly mutated: string;
    readonly offset: number;
    readonly codePoint: number;
    readonly audit: ControlCharacterFinderInFieldsOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const controlSchema = { type: "integer", enum: [9, 10, 13, 127, 133] } as const;
export const inputSchema = objectSchema(
  {
    fragments: arraySchema(textSchema, 16, 1),
    codePoints: arraySchema(controlSchema, 5, 1),
    count: countSchema(16, 1),
    seed: generatorSeedSchema,
  },
  ["fragments", "codePoints", "count"],
);
export const outputSchema = objectSchema({
  cases: arraySchema(
    objectSchema({
      original: textSchema,
      mutated: { type: "string", maxLength: 65 },
      offset: countSchema(64),
      codePoint: controlSchema,
      audit: controlCharacterFinderInFieldsOutputSchema,
    }),
    16,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is CsvControlCharacterAuditFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvControlCharacterAuditFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvControlCharacterAuditFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.codePoints, "codePoints");
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const original = csvItem(input.fragments, random),
          offset = random.integer(0, original.length),
          codePoint = csvItem(input.codePoints, random),
          mutated =
            original.slice(0, offset) +
            String.fromCodePoint(codePoint) +
            original.slice(offset);
        return {
          original,
          mutated,
          offset,
          codePoint,
          audit: coreOutput(
            calculateControlCharacterFinderInFields({ values: [mutated] }),
          ),
        };
      });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvControlCharacterAuditFixtureExample = {
  input: { fragments: ["ab", "cd"], codePoints: [9, 127], count: 1, seed: 42 },
  output: {
    cases: [
      {
        original: "cd",
        mutated: "c\u007fd",
        offset: 1,
        codePoint: 127,
        audit: { matches: [{ cell: 0, offset: 1, codePoint: 127 }] },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvControlCharacterAuditFixtureInput,
  CsvControlCharacterAuditFixtureOutput
>;
export const csvControlCharacterAuditFixtureTool = createModelDefinition<
  CsvControlCharacterAuditFixtureInput,
  CsvControlCharacterAuditFixtureOutput
>({
  id: "random/csv-control-character-audit-fixture",
  title: "Random CSV Control Character Audit Fixture Generator",
  description:
    "Insert caller-selected tab, line-break, DEL or NEL controls at sampled UTF-16 offsets and retain exact lexical audits, including preexisting controls; this does not certify security.",
  inputSchema,
  outputSchema,
  execute: calculateCsvControlCharacterAuditFixture,
});
export const runCsvControlCharacterAuditFixture =
  csvControlCharacterAuditFixtureTool.execute;
export default csvControlCharacterAuditFixtureTool;
