import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { runNumberParser } from "../../parse/number/tool.js";
import { runIntegerParser } from "../../parse/integer/tool.js";
import {
  mocksArray,
  mocksObject,
  mocksInteger,
  mocksNumber,
  mocksBoolean,
  mocksText,
  mocksNullable,
  mocksOrdered,
  mocksPick,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type NumericParserBoundaryCorpusInput = {
  readonly count: number;
  readonly minimumInteger: number;
  readonly maximumInteger: number;
  readonly seed?: number;
};
export type NumericParseObservation = {
  readonly ok: boolean;
  readonly value: number | null;
  readonly issueCodes: readonly string[];
  readonly issueFields: readonly string[];
};
export type NumericParserBoundaryCorpusOutput = {
  readonly cases: readonly {
    readonly kind: string;
    readonly text: string;
    readonly format: "plain" | "en-US" | "de-DE" | "fr-FR";
    readonly number: NumericParseObservation;
    readonly integer: NumericParseObservation;
  }[];
  readonly randomness: GeneratorReplay;
};
const observationSchema = mocksObject({
  ok: mocksBoolean,
  value: mocksNullable(mocksNumber),
  issueCodes: mocksArray(mocksText),
  issueFields: mocksArray(mocksText),
});
export const inputSchema = mocksObject(
  {
    count: { type: "integer", minimum: 1, maximum: 16 },
    minimumInteger: mocksInteger,
    maximumInteger: mocksInteger,
    seed: generatorSeedSchema,
  },
  ["count", "minimumInteger", "maximumInteger"],
);
export const outputSchema = mocksObject({
  cases: mocksArray(
    mocksObject({
      kind: mocksText,
      text: mocksText,
      format: { type: "string", enum: ["plain", "en-US", "de-DE", "fr-FR"] },
      number: observationSchema,
      integer: observationSchema,
    }),
    128,
    8,
  ),
  randomness: generatorReplaySchema,
});
const observe = (
  result: ToolResult<{ readonly value: number | null }>,
): NumericParseObservation => {
  if (result.ok) {
    const value = result.output.value;
    if (value === null || !Number.isFinite(value))
      throw new Error(
        "Successful numeric parser result must contain a finite number.",
      );
    return { ok: true, value, issueCodes: [], issueFields: [] };
  }
  if (result.error.issues.some((issue) => issue.code === "calculation_failed"))
    throw new Error("Unexpected numeric parser failure.");
  return {
    ok: false,
    value: null,
    issueCodes: result.error.issues.map((issue) => issue.code),
    issueFields: result.error.issues.map((issue) => issue.field),
  };
};
const generate = (
  input: NumericParserBoundaryCorpusInput,
  random: GeneratorRandom,
): Omit<NumericParserBoundaryCorpusOutput, "randomness"> => {
  mocksOrdered(input.minimumInteger, input.maximumInteger, "maximumInteger");
  const cases: NumericParserBoundaryCorpusOutput["cases"][number][] = [];
  for (let i = 0; i < input.count; i += 1) {
    const value = random.integer(input.minimumInteger, input.maximumInteger),
      digit = random.integer(1, 9);
    const format = mocksPick(
      ["plain", "en-US", "de-DE", "fr-FR"] as const,
      random,
    );
    const decimal = format === "de-DE" || format === "fr-FR" ? "," : ".";
    for (const [kind, text, selectedFormat] of [
      ["integer", String(value), format],
      ["fraction", String(value) + decimal + digit, format],
      ["exponent", String(value) + "e2", "plain"],
      ["whitespace", " " + value + " ", format],
      ["malformed", String(value) + "x", format],
      ["overflow", "1e309", "plain"],
      ["safe-boundary", "9007199254740991", "plain"],
      ["unsafe-boundary", "9007199254740992", "plain"],
    ] as const)
      cases.push({
        kind,
        text,
        format: selectedFormat,
        number: observe(runNumberParser({ text, format: selectedFormat })),
        integer: observe(runIntegerParser({ text, format: selectedFormat })),
      });
  }
  return { cases };
};
export const numericParserBoundaryCorpusExample = {
  input: { count: 1, minimumInteger: -20, maximumInteger: 20, seed: 42 },
  output: {
    cases: [
      {
        kind: "integer",
        text: "4",
        format: "fr-FR",
        number: { ok: true, value: 4, issueCodes: [], issueFields: [] },
        integer: { ok: true, value: 4, issueCodes: [], issueFields: [] },
      },
      {
        kind: "fraction",
        text: "4,5",
        format: "fr-FR",
        number: { ok: true, value: 4.5, issueCodes: [], issueFields: [] },
        integer: {
          ok: false,
          value: null,
          issueCodes: ["invalid_value"],
          issueFields: ["text"],
        },
      },
      {
        kind: "exponent",
        text: "4e2",
        format: "plain",
        number: { ok: true, value: 400, issueCodes: [], issueFields: [] },
        integer: { ok: true, value: 400, issueCodes: [], issueFields: [] },
      },
      {
        kind: "whitespace",
        text: " 4 ",
        format: "fr-FR",
        number: { ok: true, value: 4, issueCodes: [], issueFields: [] },
        integer: { ok: true, value: 4, issueCodes: [], issueFields: [] },
      },
      {
        kind: "malformed",
        text: "4x",
        format: "fr-FR",
        number: {
          ok: false,
          value: null,
          issueCodes: ["invalid_value"],
          issueFields: ["text"],
        },
        integer: {
          ok: false,
          value: null,
          issueCodes: ["invalid_value"],
          issueFields: ["text"],
        },
      },
      {
        kind: "overflow",
        text: "1e309",
        format: "plain",
        number: {
          ok: false,
          value: null,
          issueCodes: ["invalid_value"],
          issueFields: ["text"],
        },
        integer: {
          ok: false,
          value: null,
          issueCodes: ["invalid_value"],
          issueFields: ["text"],
        },
      },
      {
        kind: "safe-boundary",
        text: "9007199254740991",
        format: "plain",
        number: {
          ok: true,
          value: 9007199254740991,
          issueCodes: [],
          issueFields: [],
        },
        integer: {
          ok: true,
          value: 9007199254740991,
          issueCodes: [],
          issueFields: [],
        },
      },
      {
        kind: "unsafe-boundary",
        text: "9007199254740992",
        format: "plain",
        number: {
          ok: true,
          value: 9007199254740992,
          issueCodes: [],
          issueFields: [],
        },
        integer: {
          ok: false,
          value: null,
          issueCodes: ["invalid_value"],
          issueFields: ["text"],
        },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  NumericParserBoundaryCorpusInput,
  NumericParserBoundaryCorpusOutput
>;

const isInput = (input: unknown): input is NumericParserBoundaryCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateNumericParserBoundaryCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<NumericParserBoundaryCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const numericParserBoundaryCorpusTool = createModelDefinition<
  NumericParserBoundaryCorpusInput,
  NumericParserBoundaryCorpusOutput
>({
  id: "random/numeric-parser-boundary-corpus",
  title: "Random Numeric Parser Boundary Corpus Generator",
  description:
    "Generate numeric spellings and malformed, overflow, and safe-integer controls with delegated number and integer parser outcomes.",
  inputSchema,
  outputSchema,
  execute: calculateNumericParserBoundaryCorpus,
});
export const runNumericParserBoundaryCorpus =
  numericParserBoundaryCorpusTool.execute;
export default numericParserBoundaryCorpusTool;
