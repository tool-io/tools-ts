import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrossMigrationStreamTotalInput = {
  readonly streamsMatrix: ReadonlyArray<readonly number[]>;
};

export type GrossMigrationStreamTotalOutput = {
  readonly grossMigration: number;
};

export const grossMigrationStreamTotalExample = {
  input: {
    streamsMatrix: [
      [0, 500, 300],
      [200, 0, 800],
      [0, 0, 0],
    ],
  },
  output: {
    grossMigration: 1800,
  },
} satisfies ToolExample<
  GrossMigrationStreamTotalInput,
  GrossMigrationStreamTotalOutput
>;

export const calculateGrossMigrationStreams = (
  input: GrossMigrationStreamTotalInput,
): GrossMigrationStreamTotalOutput => {
  const dimension = input.streamsMatrix.length;
  if (
    dimension === 0 ||
    input.streamsMatrix.some((row) => row.length !== dimension)
  )
    simpleError(
      "streamsMatrix",
      "The origin-destination table must be a nonempty square matrix.",
      "invalid_shape",
    );
  for (const row of input.streamsMatrix)
    for (const value of row)
      if (!Number.isFinite(value) || value < 0)
        simpleError(
          "streamsMatrix",
          "Migration stream counts cannot be negative.",
          "invalid_value",
        );
  const total = input.streamsMatrix.reduce(
    (sum, row, origin) =>
      sum +
      row.reduce(
        (rowSum, value, destination) =>
          rowSum + (origin === destination ? 0 : value),
        0,
      ),
    0,
  );
  if (!Number.isFinite(total))
    simpleError(
      "streamsMatrix",
      "Gross migration is outside the finite numeric range.",
      "numeric_range",
    );
  return { grossMigration: total };
};

export const grossMigrationStreamTotalTool = createSimpleTool({
  calculate: (input) =>
    calculateGrossMigrationStreams({
      streamsMatrix: input.streamsMatrix as ReadonlyArray<readonly number[]>,
    }),
  description:
    "Sum every off-diagonal origin-destination cell of a square migration stream table into gross migration, excluding non-movers on the diagonal.",
  id: "sociology/gross-migration-stream-total",
  inputs: [
    {
      description:
        "Square origin-by-destination count matrix; diagonal non-movers are excluded from gross migration.",
      id: "streamsMatrix",
      kind: "matrix",
      label: "Stream matrix",
    },
  ],
  outputs: [
    {
      description: "All moves counted across every stream.",
      id: "grossMigration",
      kind: "number",
      label: "Gross migration",
    },
  ],
  title: "Gross Migration Stream Total Calculator",
});
export const runGrossMigrationStreamTotal =
  grossMigrationStreamTotalTool.execute;
export default grossMigrationStreamTotalTool;
