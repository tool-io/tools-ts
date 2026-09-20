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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { runPalindromeChecker } from "../../text/palindrome-checker/tool.js";
import { generatorSampleIndices } from "../generator-random.js";

export type PalindromeConstructionPuzzleInput = {
  readonly mode: "characters" | "words";
  readonly units: readonly string[];
  readonly unitCount: number;
  readonly hiddenCount: number;
  readonly seed?: number;
};
export type PalindromeConstructionPuzzleOutput = {
  readonly solutionUnits: readonly string[];
  readonly solutionText: string;
  readonly puzzleUnits: readonly (string | null)[];
  readonly puzzleText: string;
  readonly hiddenIndices: readonly number[];
  readonly checkerVerified: boolean;
  readonly randomness: GeneratorReplay;
};
const unitSchema = {
  type: "string",
  minLength: 1,
  maxLength: 32,
  pattern: "^[A-Za-z0-9]+(?![\\s\\S])",
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: { type: "string", enum: ["characters", "words"] },
    units: { type: "array", minItems: 1, maxItems: 64, items: unitSchema },
    unitCount: { type: "integer", minimum: 1, maximum: 64 },
    hiddenCount: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: ["mode", "units", "unitCount", "hiddenCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solutionUnits: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: unitSchema,
    },
    solutionText: { type: "string", minLength: 1, maxLength: 2111 },
    puzzleUnits: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: { anyOf: [unitSchema, { type: "null" }] },
    },
    puzzleText: { type: "string", minLength: 1, maxLength: 2111 },
    hiddenIndices: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: { type: "integer", minimum: 0, maximum: 63 },
    },
    checkerVerified: { type: "boolean" },
    randomness: generatorReplaySchema,
  },
  required: [
    "solutionUnits",
    "solutionText",
    "puzzleUnits",
    "puzzleText",
    "hiddenIndices",
    "checkerVerified",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is PalindromeConstructionPuzzleInput =>
  matchesModelInput(input, inputSchema);
export const calculatePalindromeConstructionPuzzle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PalindromeConstructionPuzzleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.hiddenCount > input.unitCount)
      simpleError(
        "hiddenCount",
        "Cannot hide more positions than the constructed palindrome.",
        "invalid_hidden_count",
      );
    for (const unit of input.units) {
      if (input.mode === "characters" && unit.length !== 1)
        simpleError(
          "units",
          "Character mode requires single ASCII letters or digits.",
          "invalid_unit",
        );
      const checked = runPalindromeChecker({ text: unit });
      if (!checked.ok || !checked.output.isPalindrome)
        simpleError(
          "units",
          "Each supplied word must itself be palindromic under the checker.",
          "nonpalindromic_unit",
        );
    }
    const random = createGeneratorRandom(input.seed, context),
      half = Array.from({ length: Math.ceil(input.unitCount / 2) }, () =>
        random.pick(input.units),
      );
    const solutionUnits = [
      ...half,
      ...half.slice(0, Math.floor(input.unitCount / 2)).reverse(),
    ];
    const hiddenIndices = generatorSampleIndices(
        input.unitCount,
        input.hiddenCount,
        random,
      ).sort((a, b) => a - b),
      hidden = new Set(hiddenIndices),
      puzzleUnits = solutionUnits.map((unit, i) =>
        hidden.has(i) ? null : unit,
      );
    const separator = input.mode === "words" ? " " : "",
      solutionText = solutionUnits.join(separator),
      puzzleText = puzzleUnits.map((unit) => unit ?? "____").join(separator);
    const checked = runPalindromeChecker({ text: solutionText });
    if (!checked.ok)
      throw new Error("Constructed ASCII palindrome was rejected.");
    return toolSuccess({
      solutionUnits,
      solutionText,
      puzzleUnits,
      puzzleText,
      hiddenIndices,
      checkerVerified: checked.output.isPalindrome,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const palindromeConstructionPuzzleExample = {
  input: {
    mode: "words",
    units: ["level", "civic", "radar"],
    unitCount: 7,
    hiddenCount: 3,
    seed: 42,
  },
  output: {
    solutionUnits: [
      "civic",
      "civic",
      "radar",
      "radar",
      "radar",
      "civic",
      "civic",
    ],
    solutionText: "civic civic radar radar radar civic civic",
    puzzleUnits: ["civic", null, "radar", null, "radar", "civic", null],
    puzzleText: "civic ____ radar ____ radar civic ____",
    hiddenIndices: [1, 3, 6],
    checkerVerified: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  PalindromeConstructionPuzzleInput,
  PalindromeConstructionPuzzleOutput
>;
export const palindromeConstructionPuzzleTool = createModelDefinition<
  PalindromeConstructionPuzzleInput,
  PalindromeConstructionPuzzleOutput
>({
  id: "random/palindrome-construction-puzzle",
  title: "Random Palindrome Construction Puzzle Generator",
  description:
    "Sample an ASCII alphanumeric character bank or caller-supplied individually palindromic words, mirror units, hide distinct positions, and return a checker-verified completion. The checker ignores case and separators; the supplied completion need not be unique and word mode requires each word to be a palindrome.",
  inputSchema,
  outputSchema,
  execute: calculatePalindromeConstructionPuzzle,
});
export const runPalindromeConstructionPuzzle =
  palindromeConstructionPuzzleTool.execute;
export default palindromeConstructionPuzzleTool;
