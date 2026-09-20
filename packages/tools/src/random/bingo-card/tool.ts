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
import { runUnique } from "../../list/unique/tool.js";

export type BingoCardInput = {
  readonly rows: number;
  readonly columnBounds: readonly {
    readonly minimum: number;
    readonly maximum: number;
  }[];
  readonly uniqueness: "column" | "card";
  readonly freeCell?: { readonly row: number; readonly column: number };
  readonly maximumSearchSteps: number;
  readonly seed?: number;
};
export type BingoCardOutput = {
  readonly board: {
    readonly values: readonly (readonly (number | null)[])[];
    readonly freeCell: { readonly row: number; readonly column: number } | null;
  };
  readonly uniqueNumbers: readonly number[];
  readonly filledCellCount: number;
  readonly searchSteps: number;
  readonly randomness: GeneratorReplay;
};
const position = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0, maximum: 15 },
    column: { type: "integer", minimum: 0, maximum: 15 },
  },
  required: ["row", "column"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1, maximum: 16 },
    columnBounds: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          minimum: { type: "integer" },
          maximum: { type: "integer" },
        },
        required: ["minimum", "maximum"],
      },
    },
    uniqueness: { type: "string", enum: ["column", "card"] },
    freeCell: position,
    maximumSearchSteps: { type: "integer", minimum: 1, maximum: 1000000 },
    seed: generatorSeedSchema,
  },
  required: ["rows", "columnBounds", "uniqueness", "maximumSearchSteps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    board: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: {
          type: "array",
          minItems: 1,
          maxItems: 16,
          items: {
            type: "array",
            minItems: 1,
            maxItems: 16,
            items: { anyOf: [{ type: "integer" }, { type: "null" }] },
          },
        },
        freeCell: { anyOf: [position, { type: "null" }] },
      },
      required: ["values", "freeCell"],
    },
    uniqueNumbers: { type: "array", maxItems: 256, items: { type: "integer" } },
    filledCellCount: { type: "integer", minimum: 0, maximum: 256 },
    searchSteps: { type: "integer", minimum: 0, maximum: 1000000 },
    randomness: generatorReplaySchema,
  },
  required: [
    "board",
    "uniqueNumbers",
    "filledCellCount",
    "searchSteps",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is BingoCardInput =>
  matchesModelInput(input, inputSchema);
export const calculateBingoCard = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BingoCardOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const columns = input.columnBounds.length;
    if (
      input.freeCell &&
      (input.freeCell.row >= input.rows || input.freeCell.column >= columns)
    )
      simpleError(
        "freeCell",
        "The free cell must lie inside the board.",
        "free_cell_outside_board",
      );
    for (const bound of input.columnBounds) {
      const width = bound.maximum - bound.minimum + 1;
      if (bound.maximum < bound.minimum || !Number.isSafeInteger(width))
        simpleError(
          "columnBounds",
          "Column bounds must form safe ordered inclusive integer ranges.",
          "invalid_column_range",
        );
      if (width > 512)
        simpleError(
          "columnBounds",
          "Each enumerated column domain is limited to 512 numbers.",
          "resource_limit",
        );
    }
    const random = createGeneratorRandom(input.seed, context);
    const domains = input.columnBounds.map((bound) =>
      random.shuffle(
        Array.from(
          { length: bound.maximum - bound.minimum + 1 },
          (_, i) => bound.minimum + i,
        ),
      ),
    );
    const slots: { row: number; column: number }[] = [];
    for (let row = 0; row < input.rows; row += 1)
      for (let column = 0; column < columns; column += 1) {
        const isFree =
          input.freeCell !== undefined &&
          input.freeCell.row === row &&
          input.freeCell.column === column;
        if (!isFree) slots.push({ row, column });
      }
    const order = random.shuffle(slots.map((_, i) => i)),
      owners = new Map<string, number>(),
      assignment: (number | null)[] = Array(slots.length).fill(null);
    let searchSteps = 0;
    const augment = (slot: number, seen: Set<string>): boolean => {
      for (const value of domains[slots[slot].column]) {
        searchSteps += 1;
        if (searchSteps > input.maximumSearchSteps)
          simpleError(
            "maximumSearchSteps",
            "The augmenting-path search exhausted its explicit work budget.",
            "resource_limit",
          );
        const key = JSON.stringify([
          input.uniqueness === "card" ? 0 : slots[slot].column,
          value,
        ]);
        if (seen.has(key)) continue;
        seen.add(key);
        const previous = owners.get(key);
        if (previous === undefined || augment(previous, seen)) {
          owners.set(key, slot);
          assignment[slot] = value;
          return true;
        }
      }
      return false;
    };
    for (const slot of order)
      if (!augment(slot, new Set()))
        simpleError(
          "columnBounds",
          "No complete board satisfies the selected ranges and uniqueness rule.",
          "infeasible_bingo_card",
        );
    const values: (number | null)[][] = Array.from({ length: input.rows }, () =>
      Array<number | null>(columns).fill(null),
    );
    const filled: number[] = [];
    slots.forEach((slot, i) => {
      const value = assignment[i];
      if (value === null)
        throw new Error("A matched bingo slot has no assigned number.");
      values[slot.row][slot.column] = value;
      filled.push(value);
    });
    const deduplicated = runUnique({ values: filled.map(String) });
    if (!deduplicated.ok)
      throw new Error("Generated bingo numbers could not be deduplicated.");
    const uniqueNumbers = deduplicated.output.values
      .map(Number)
      .sort((a, b) => a - b);
    if (input.uniqueness === "card" && uniqueNumbers.length !== slots.length)
      throw new Error("Card-wide matching retained a duplicate.");
    return toolSuccess({
      board: {
        values,
        freeCell: input.freeCell ? { ...input.freeCell } : null,
      },
      uniqueNumbers,
      filledCellCount: slots.length,
      searchSteps,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const bingoCardExample = {
  input: {
    rows: 3,
    columnBounds: [
      {
        minimum: 1,
        maximum: 5,
      },
      {
        minimum: 6,
        maximum: 10,
      },
      {
        minimum: 11,
        maximum: 15,
      },
    ],
    uniqueness: "card",
    freeCell: {
      row: 1,
      column: 1,
    },
    maximumSearchSteps: 10000,
    seed: 42,
  },
  output: {
    board: {
      values: [
        [5, 9, 13],
        [3, null, 14],
        [1, 7, 11],
      ],
      freeCell: {
        row: 1,
        column: 1,
      },
    },
    uniqueNumbers: [1, 3, 5, 7, 9, 11, 13, 14],
    filledCellCount: 8,
    searchSteps: 24,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<BingoCardInput, BingoCardOutput>;
export const bingoCardTool = createModelDefinition<
  BingoCardInput,
  BingoCardOutput
>({
  id: "random/bingo-card",
  title: "Random Configurable Bingo Card Generator",
  description:
    "Generate a bounded integer bingo grid with explicit column ranges, column/card-wide uniqueness and an optional free cell using randomized augmenting-path matching; overlapping ranges are supported, search is bounded and cards are not uniform over all feasible layouts.",
  inputSchema,
  outputSchema,
  execute: calculateBingoCard,
});
export const runBingoCard = bingoCardTool.execute;
export default bingoCardTool;
