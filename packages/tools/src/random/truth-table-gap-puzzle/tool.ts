import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculateTautologyAllTrueChecker } from "../../logic/tautology-all-true-checker/tool.js";
import { calculateContradictionAllFalseChecker } from "../../logic/contradiction-all-false-checker/tool.js";
import { calculateContingencyMixedClassifier } from "../../logic/contingency-mixed-classifier/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSampleIndices,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  puzzleArray,
  puzzleBoolean,
  puzzleDistinct,
  puzzleExecutor,
  puzzleFreeze,
  puzzleIdentifier,
  puzzleObject,
  puzzleUnwrap,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type CallerVerifiedTruthPair = {
  readonly formula: string;
  readonly values: readonly boolean[];
};
export type TruthTableGapPuzzleInput = {
  readonly variables: readonly string[];
  readonly pairs: readonly CallerVerifiedTruthPair[];
  readonly callerVerified: true;
  readonly provenance: string;
  readonly hiddenCount: number;
  readonly count: number;
  readonly seed?: number;
};
export type TruthTableGapPuzzleOutput = {
  readonly contentSource: "caller-provided";
  readonly variables: readonly string[];
  readonly valuationOrder: "ascending-binary-false-first-msb";
  readonly valuations: readonly (readonly boolean[])[];
  readonly cases: readonly {
    readonly puzzle: {
      readonly formula: string;
      readonly cells: readonly (boolean | null)[];
    };
    readonly answer: {
      readonly values: readonly boolean[];
      readonly classification: "tautology" | "contradiction" | "contingency";
      readonly tautology: boolean;
      readonly contradiction: boolean;
    };
  }[];
  readonly provenance: string;
  readonly randomness: GeneratorReplay;
};
const formula = { type: "string", minLength: 1, maxLength: 256 } as const,
  column = puzzleArray(puzzleBoolean, 256, 1),
  provenance = { type: "string", minLength: 1, maxLength: 512 } as const;
export const inputSchema = puzzleObject(
  {
    variables: puzzleArray(puzzleIdentifier, 8),
    pairs: puzzleArray(puzzleObject({ formula, values: column }), 32, 1),
    callerVerified: { type: "boolean", const: true },
    provenance,
    hiddenCount: { type: "integer", minimum: 0, maximum: 256 },
    count: { type: "integer", minimum: 1, maximum: 32 },
    seed: generatorSeedSchema,
  },
  [
    "variables",
    "pairs",
    "callerVerified",
    "provenance",
    "hiddenCount",
    "count",
  ],
);
export const outputSchema = puzzleObject({
  contentSource: { type: "string", const: "caller-provided" },
  variables: puzzleArray(puzzleIdentifier, 8),
  valuationOrder: { type: "string", const: "ascending-binary-false-first-msb" },
  valuations: puzzleArray(puzzleArray(puzzleBoolean, 8), 256, 1),
  cases: puzzleArray(
    puzzleObject({
      puzzle: puzzleObject({
        formula,
        cells: puzzleArray(
          { anyOf: [puzzleBoolean, { type: "null" }] },
          256,
          1,
        ),
      }),
      answer: puzzleObject({
        values: column,
        classification: {
          type: "string",
          enum: ["tautology", "contradiction", "contingency"],
        },
        tautology: puzzleBoolean,
        contradiction: puzzleBoolean,
      }),
    }),
    32,
    1,
  ),
  provenance,
  randomness: generatorReplaySchema,
});
export const calculateTruthTableGapPuzzle = (
  input: TruthTableGapPuzzleInput,
  context?: ToolExecutionContext,
): ToolResult<TruthTableGapPuzzleOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    puzzleDistinct(input.variables, "variables");
    puzzleDistinct(
      input.pairs.map((pair) => pair.formula),
      "pairs",
    );
    const rowCount = 2 ** input.variables.length;
    if (input.pairs.some((pair) => pair.values.length !== rowCount))
      simpleError(
        "pairs",
        "Every supplied column must cover all valuations of the declared variables in ascending binary order.",
        "incomplete_table",
      );
    if (input.hiddenCount > rowCount)
      simpleError(
        "hiddenCount",
        "Hidden cells cannot exceed truth-table rows.",
        "infeasible_hidden_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      valuations = Array.from({ length: rowCount }, (_, row) =>
        input.variables.map(
          (_, i) =>
            Math.floor(row / 2 ** (input.variables.length - i - 1)) % 2 === 1,
        ),
      );
    const cases = Array.from({ length: input.count }, () => {
      const pair = random.pick(input.pairs),
        hidden = new Set(
          generatorSampleIndices(rowCount, input.hiddenCount, random),
        ),
        values = [...pair.values],
        tautology = puzzleUnwrap(
          calculateTautologyAllTrueChecker({ values }),
        ).tautology,
        contradiction = puzzleUnwrap(
          calculateContradictionAllFalseChecker({ values }),
        ).contradiction,
        classification = puzzleUnwrap(
          calculateContingencyMixedClassifier({ values }),
        ).classification;
      return {
        puzzle: {
          formula: pair.formula,
          cells: values.map((v, i) => (hidden.has(i) ? null : v)),
        },
        answer: { values, classification, tautology, contradiction },
      };
    });
    return toolSuccess({
      contentSource: "caller-provided",
      variables: [...input.variables],
      valuationOrder: "ascending-binary-false-first-msb",
      valuations,
      cases,
      provenance: input.provenance,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const truthTableGapPuzzleExample = puzzleFreeze({
  input: {
    variables: ["p", "q"],
    pairs: [
      { formula: "p || !p", values: [true, true, true, true] },
      { formula: "p && q", values: [false, false, false, true] },
    ],
    callerVerified: true,
    provenance: "Caller-verified illustrative formula/table pairs",
    hiddenCount: 2,
    count: 1,
    seed: 42,
  },
  output: {
    contentSource: "caller-provided",
    variables: ["p", "q"],
    valuationOrder: "ascending-binary-false-first-msb",
    valuations: [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ],
    cases: [
      {
        puzzle: { formula: "p && q", cells: [false, null, null, true] },
        answer: {
          values: [false, false, false, true],
          classification: "contingency",
          tautology: false,
          contradiction: false,
        },
      },
    ],
    provenance: "Caller-verified illustrative formula/table pairs",
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  TruthTableGapPuzzleInput,
  TruthTableGapPuzzleOutput
>);
const isInput = (input: unknown): input is TruthTableGapPuzzleInput =>
  matchesModelInput(input, inputSchema);
export const truthTableGapPuzzleTool = createModelDefinition<
  TruthTableGapPuzzleInput,
  TruthTableGapPuzzleOutput
>({
  id: "random/truth-table-gap-puzzle",
  title: "Random Truth Table Gap Puzzle Generator",
  description:
    "Hide selected cells in caller-provided, caller-verified formula/truth-table pairs and classify the answer column without parsing or evaluating the formula.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(isInput, inputSchema, calculateTruthTableGapPuzzle),
});
export const runTruthTableGapPuzzle = truthTableGapPuzzleTool.execute;
export default truthTableGapPuzzleTool;
