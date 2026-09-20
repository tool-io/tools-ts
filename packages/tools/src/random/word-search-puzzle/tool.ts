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
import { calculateRandomLetter } from "../letter/tool.js";
import { runUppercase } from "../../text/uppercase/tool.js";

export type WordSearchDirection =
  "E" | "W" | "N" | "S" | "NE" | "NW" | "SE" | "SW";
export type WordSearchPuzzleInput = {
  readonly words: readonly string[];
  readonly rows: number;
  readonly columns: number;
  readonly directions: readonly WordSearchDirection[];
  readonly maximumAttempts: number;
  readonly seed?: number;
};
export type WordSearchPlacement = {
  readonly wordIndex: number;
  readonly word: string;
  readonly row: number;
  readonly column: number;
  readonly direction: WordSearchDirection;
};
export type WordSearchPuzzleOutput = {
  readonly grid: readonly (readonly string[])[];
  readonly answerGrid: readonly (readonly string[])[];
  readonly placements: readonly WordSearchPlacement[];
  readonly attempts: number;
  readonly randomness: GeneratorReplay;
};
const directionSchema = {
  type: "string",
  enum: ["E", "W", "N", "S", "NE", "NW", "SE", "SW"],
} as const;
const gridSchema = {
  type: "array",
  minItems: 1,
  maxItems: 32,
  items: {
    type: "array",
    minItems: 1,
    maxItems: 32,
    items: {
      type: "string",
      minLength: 1,
      maxLength: 1,
      pattern: "^[A-Z.](?![\\s\\S])",
    },
  },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    words: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "string",
        minLength: 1,
        maxLength: 20,
        pattern: "^[A-Za-z]+(?![\\s\\S])",
      },
    },
    rows: { type: "integer", minimum: 1, maximum: 32 },
    columns: { type: "integer", minimum: 1, maximum: 32 },
    directions: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: directionSchema,
    },
    maximumAttempts: { type: "integer", minimum: 1, maximum: 250000 },
    seed: generatorSeedSchema,
  },
  required: ["words", "rows", "columns", "directions", "maximumAttempts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grid: gridSchema,
    answerGrid: gridSchema,
    placements: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          wordIndex: { type: "integer", minimum: 0, maximum: 15 },
          word: {
            type: "string",
            minLength: 1,
            maxLength: 20,
            pattern: "^[A-Z]+(?![\\s\\S])",
          },
          row: { type: "integer", minimum: 0, maximum: 31 },
          column: { type: "integer", minimum: 0, maximum: 31 },
          direction: directionSchema,
        },
        required: ["wordIndex", "word", "row", "column", "direction"],
      },
    },
    attempts: { type: "integer", minimum: 1, maximum: 250000 },
    randomness: generatorReplaySchema,
  },
  required: ["grid", "answerGrid", "placements", "attempts", "randomness"],
} as const;
const steps: Readonly<Record<WordSearchDirection, readonly [number, number]>> =
  {
    E: [0, 1],
    W: [0, -1],
    N: [-1, 0],
    S: [1, 0],
    NE: [-1, 1],
    NW: [-1, -1],
    SE: [1, 1],
    SW: [1, -1],
  };
const isInput = (input: unknown): input is WordSearchPuzzleInput =>
  matchesModelInput(input, inputSchema);
export const calculateWordSearchPuzzle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WordSearchPuzzleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.directions).size !== input.directions.length)
      simpleError(
        "directions",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    const words = input.words.map((word) => {
      const result = runUppercase({ text: word, locale: "en-US" });
      if (!result.ok)
        throw new Error(
          "Validated ASCII word was rejected by the uppercase core.",
        );
      return result.output.text as string;
    });
    if (new Set(words).size !== words.length)
      simpleError(
        "words",
        "Words must be distinct after ASCII case normalization.",
        "duplicate_word",
      );
    if (
      words.reduce((sum, word) => sum + word.length, 0) *
        input.rows *
        input.columns *
        input.directions.length >
      2000000
    )
      simpleError(
        "words",
        "Candidate enumeration is limited to two million letter-position checks.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const candidates = words.map((word, wordIndex) => {
      const positions: WordSearchPlacement[] = [];
      for (let row = 0; row < input.rows; row += 1)
        for (let column = 0; column < input.columns; column += 1)
          for (const direction of input.directions) {
            const [dr, dc] = steps[direction],
              lastRow = row + dr * (word.length - 1),
              lastColumn = column + dc * (word.length - 1);
            if (
              lastRow >= 0 &&
              lastRow < input.rows &&
              lastColumn >= 0 &&
              lastColumn < input.columns
            )
              positions.push({ wordIndex, word, row, column, direction });
          }
      if (!positions.length)
        simpleError(
          "words",
          "Every word must geometrically fit at least one selected direction.",
          "word_does_not_fit",
        );
      return random.shuffle(positions);
    });
    const order = words
      .map((_, index) => index)
      .sort((a, b) => words[b].length - words[a].length || a - b);
    const answerGrid = Array.from({ length: input.rows }, () =>
      Array<string>(input.columns).fill("."),
    );
    const placements: WordSearchPlacement[] = Array(words.length);
    let attempts = 0;
    const search = (depth: number): boolean => {
      if (depth === order.length) return true;
      const wordIndex = order[depth],
        word = words[wordIndex];
      for (const placement of candidates[wordIndex]) {
        if (attempts >= input.maximumAttempts)
          simpleError(
            "maximumAttempts",
            "The bounded placement search exhausted its attempt budget.",
            "placement_search_exhausted",
          );
        attempts += 1;
        const [dr, dc] = steps[placement.direction],
          cells = [...word].map((letter, i) => ({
            letter,
            row: placement.row + dr * i,
            column: placement.column + dc * i,
          }));
        if (
          cells.some(
            (cell) =>
              answerGrid[cell.row][cell.column] !== "." &&
              answerGrid[cell.row][cell.column] !== cell.letter,
          )
        )
          continue;
        const changed = cells.filter(
          (cell) => answerGrid[cell.row][cell.column] === ".",
        );
        changed.forEach((cell) => {
          answerGrid[cell.row][cell.column] = cell.letter;
        });
        placements[wordIndex] = placement;
        if (search(depth + 1)) return true;
        changed.forEach((cell) => {
          answerGrid[cell.row][cell.column] = ".";
        });
      }
      return false;
    };
    if (!search(0))
      simpleError(
        "words",
        "No compatible placement exists for these words, dimensions, and directions.",
        "no_feasible_placement",
      );
    const grid = answerGrid.map((row) =>
      row.map((cell) => {
        if (cell !== ".") return cell;
        const letter = calculateRandomLetter("uppercase", random.unit);
        if (letter === null)
          throw new Error(
            "The random-letter core rejected its fixed uppercase mode.",
          );
        return letter;
      }),
    );
    return toolSuccess({
      grid,
      answerGrid,
      placements,
      attempts,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const wordSearchPuzzleExample = {
  input: {
    words: ["ab", "c"],
    rows: 2,
    columns: 2,
    directions: ["E"],
    maximumAttempts: 100,
    seed: 42,
  },
  output: {
    grid: [
      ["A", "B"],
      ["E", "C"],
    ],
    answerGrid: [
      ["A", "B"],
      [".", "C"],
    ],
    placements: [
      {
        wordIndex: 0,
        word: "AB",
        row: 0,
        column: 0,
        direction: "E",
      },
      {
        wordIndex: 1,
        word: "C",
        row: 1,
        column: 1,
        direction: "E",
      },
    ],
    attempts: 3,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<WordSearchPuzzleInput, WordSearchPuzzleOutput>;
export const wordSearchPuzzleTool = createModelDefinition<
  WordSearchPuzzleInput,
  WordSearchPuzzleOutput
>({
  id: "random/word-search-puzzle",
  title: "Random Word Search Puzzle Generator",
  description:
    "Place caller-supplied ASCII words in a seeded bounded grid using selected compass directions, compatible crossings, and backtracking, then fill unused cells with random uppercase letters; return planted placements and a separate answer grid, without a unique-solution or no-accidental-word guarantee.",
  inputSchema,
  outputSchema,
  execute: calculateWordSearchPuzzle,
});
export const runWordSearchPuzzle = wordSearchPuzzleTool.execute;
export default wordSearchPuzzleTool;
