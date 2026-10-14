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
import { generatorFailure } from "../../random/generator-random.js";

export type RoughSetApproximationsInput = {
  readonly rows: readonly (readonly string[])[];
  readonly conditionColumns: readonly number[];
  readonly targetRows: readonly number[];
};
export type RoughSetApproximationsOutput = {
  readonly equivalenceClasses: readonly (readonly number[])[];
  readonly classByRow: readonly number[];
  readonly lower: readonly number[];
  readonly upper: readonly number[];
  readonly boundary: readonly number[];
  readonly negative: readonly number[];
};
const rowIds = {
  type: "array",
  maxItems: 512,
  items: { type: "integer", minimum: 0, maximum: 511 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: {
      type: "array",
      minItems: 1,
      maxItems: 512,
      items: {
        type: "array",
        maxItems: 32,
        items: { type: "string", maxLength: 128 },
      },
    },
    conditionColumns: {
      type: "array",
      maxItems: 32,
      items: { type: "integer", minimum: 0, maximum: 31 },
    },
    targetRows: rowIds,
  },
  required: ["rows", "conditionColumns", "targetRows"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalenceClasses: {
      type: "array",
      minItems: 1,
      maxItems: 512,
      items: { ...rowIds, minItems: 1 },
    },
    classByRow: { ...rowIds, minItems: 1 },
    lower: rowIds,
    upper: rowIds,
    boundary: rowIds,
    negative: rowIds,
  },
  required: [
    "equivalenceClasses",
    "classByRow",
    "lower",
    "upper",
    "boundary",
    "negative",
  ],
} as const;

const isInput = (input: unknown): input is RoughSetApproximationsInput =>
  matchesModelInput(input, inputSchema);
export const calculateRoughSetApproximations = (
  input: unknown,
): ToolResult<RoughSetApproximationsOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const width = input.rows[0].length;
    if (input.rows.some((row) => row.length !== width))
      simpleError(
        "rows",
        "All rows must have the same column count.",
        "ragged_rows",
      );
    if (
      new Set(input.conditionColumns).size !== input.conditionColumns.length ||
      input.conditionColumns.some((column) => column >= width)
    )
      simpleError(
        "conditionColumns",
        "Select distinct existing column indices.",
        "invalid_column_selection",
      );
    if (
      new Set(input.targetRows).size !== input.targetRows.length ||
      input.targetRows.some((row) => row >= input.rows.length)
    )
      simpleError(
        "targetRows",
        "Select distinct existing row indices.",
        "invalid_target_selection",
      );
    const groups = new Map<string, number[]>(),
      target = new Set(input.targetRows);
    input.rows.forEach((row, index) => {
      const key = JSON.stringify(
        input.conditionColumns.map((column) => row[column]),
      );
      const group = groups.get(key) ?? [];
      group.push(index);
      groups.set(key, group);
    });
    const equivalenceClasses = [...groups.values()],
      classByRow = Array<number>(input.rows.length),
      lower: number[] = [],
      upper: number[] = [],
      boundary: number[] = [],
      negative: number[] = [];
    equivalenceClasses.forEach((group, classId) => {
      for (const row of group) classByRow[row] = classId;
      const included = group.filter((row) => target.has(row)).length;
      if (included === group.length) lower.push(...group);
      if (included > 0) upper.push(...group);
      else negative.push(...group);
      if (included > 0 && included < group.length) boundary.push(...group);
    });
    for (const region of [lower, upper, boundary, negative])
      region.sort((a, b) => a - b);
    return toolSuccess({
      equivalenceClasses,
      classByRow,
      lower,
      upper,
      boundary,
      negative,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const roughSetApproximationsExample = {
  input: {
    rows: [
      ["red", "S"],
      ["red", "M"],
      ["blue", "S"],
      ["blue", "S"],
    ],
    conditionColumns: [0],
    targetRows: [0, 2, 3],
  },
  output: {
    equivalenceClasses: [
      [0, 1],
      [2, 3],
    ],
    classByRow: [0, 0, 1, 1],
    lower: [2, 3],
    upper: [0, 1, 2, 3],
    boundary: [0, 1],
    negative: [],
  },
} satisfies ToolExample<
  RoughSetApproximationsInput,
  RoughSetApproximationsOutput
>;
export const roughSetApproximationsTool = createModelDefinition<
  RoughSetApproximationsInput,
  RoughSetApproximationsOutput
>({
  discovery: {
    aliases: [
      "Rough Set Lower and Upper Approximation Calculator",
      "Rough Set Lower and Upper Approximation Tool",
      "data mining",
      "machine learning",
    ],
    collections: ["ai", "data"],
    fields: ["data-mining", "data mining", "machine learning"],
    keywords: ["data mining", "machine learning"],
  },
  id: "data-mining/rough-set-approximations",
  title: "Rough Set Lower and Upper Approximation Calculator",
  description:
    "Compute Pawlak lower, upper, boundary and negative regions for a supplied row-index target under exact equality of selected categorical columns; empty column selection creates one indiscernibility class.",
  inputSchema,
  outputSchema,
  execute: calculateRoughSetApproximations,
});
export const runRoughSetApproximations = roughSetApproximationsTool.execute;
export default roughSetApproximationsTool;
