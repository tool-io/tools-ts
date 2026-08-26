import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MigrationEffectivenessIndexEmInput = {
  readonly streams: readonly number[][];
};

export type MigrationEffectivenessIndexEmOutput = {
  readonly effectivenessIndex: number;
};

const isMatrix = (
  value: readonly unknown[],
): value is readonly (readonly number[])[] =>
  value.every(
    (row) =>
      Array.isArray(row) &&
      row.length === value.length &&
      row.every(
        (entry) =>
          typeof entry === "number" && Number.isFinite(entry) && entry >= 0,
      ),
  );

export const calculateMigrationEffectivenessIndexEm = (
  input: MigrationEffectivenessIndexEmInput,
): MigrationEffectivenessIndexEmOutput => {
  const matrix = input.streams;
  if (!Array.isArray(matrix) || matrix.length === 0 || !isMatrix(matrix))
    simpleError(
      "streams",
      "Provide a square, non-negative numeric origin-destination matrix.",
      "invalid_matrix",
    );
  let netSum = 0;
  let turnover = 0;
  for (let origin = 0; origin < matrix.length; origin += 1) {
    let outTotal = 0;
    let inTotal = 0;
    for (let destination = 0; destination < matrix.length; destination += 1) {
      outTotal += matrix[origin]![destination]!;
      inTotal += matrix[destination]![origin]!;
    }
    netSum += Math.abs(inTotal - outTotal);
    turnover += inTotal + outTotal;
  }
  if (!(turnover > 0))
    simpleError(
      "streams",
      "The matrix must contain at least one positive stream.",
      "invalid_matrix",
    );
  return { effectivenessIndex: netSum / turnover };
};

export const migrationEffectivenessIndexEmExample = {
  input: {
    streams: [
      [0, 100, 50],
      [40, 0, 30],
      [20, 60, 0],
    ],
  },
  output: { effectivenessIndex: 0.3 },
} satisfies ToolExample<
  MigrationEffectivenessIndexEmInput,
  MigrationEffectivenessIndexEmOutput
>;

export const migrationEffectivenessIndexEmTool = createSimpleTool({
  id: "demography/migration-effectiveness-index-em",
  title: "Migration Effectiveness Index EM Calculator",
  description:
    "Compute the migration effectiveness index as the sum of absolute regional net inflows divided by total migration turnover of an origin-destination matrix.",
  inputs: [
    {
      description:
        "Square matrix whose rows are origins and columns are destinations.",
      id: "streams",
      kind: "matrix",
      label: "Streams",
    },
  ],
  outputs: [
    {
      description:
        "Effectiveness index between zero and one; higher values signal more one-sided flows.",
      id: "effectivenessIndex",
      kind: "number",
      label: "EM",
    },
  ],
  calculate: (input) =>
    calculateMigrationEffectivenessIndexEm(
      input as unknown as MigrationEffectivenessIndexEmInput,
    ),
});

export const runMigrationEffectivenessIndexEm =
  migrationEffectivenessIndexEmTool.execute;
export default migrationEffectivenessIndexEmTool;
