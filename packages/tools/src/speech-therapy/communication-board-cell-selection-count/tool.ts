import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rows: number;
  readonly columns: number;
  readonly disabledIndices: readonly number[];
};
export type Output = {
  readonly totalCells: number;
  readonly selectableCells: number;
  readonly disabledUnique: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
    disabledIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["rows", "columns", "disabledIndices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCells: { type: "integer" },
    selectableCells: { type: "integer" },
    disabledUnique: { type: "integer" },
  },
  required: ["totalCells", "selectableCells", "disabledUnique"],
} as const;
/** Calculate communication board cell selection count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns, disabledIndices } = request;
  const compute = (): Output => {
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.domain(disabledIndices.every((x) => x >= 0 && x < rows * columns));
    return {
      totalCells: rows * columns,
      selectableCells: rows * columns - new Set(disabledIndices).size,
      disabledUnique: new Set(disabledIndices).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rows: 4, columns: 5, disabledIndices: [0, 3, 3] },
  output: { totalCells: 20, selectableCells: 18, disabledUnique: 2 },
} satisfies ToolExample<Input, Output>;
export const communicationBoardCellSelectionCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "speech-therapy/communication-board-cell-selection-count",
      title: "Communication Board Cell Selection Count Tool",
      description:
        "Calculate communication board cell selection count from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rows: { type: "integer", minimum: 1 },
          columns: { type: "integer", minimum: 1 },
          disabledIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["rows", "columns", "disabledIndices"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalCells: { type: "integer" },
          selectableCells: { type: "integer" },
          disabledUnique: { type: "integer" },
        },
        required: ["totalCells", "selectableCells", "disabledUnique"],
      },
      ports: {
        inputs: [
          {
            id: "rows",
            label: "Rows",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "columns",
            label: "Columns",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "disabledIndices",
            label: "Disabled Indices",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "totalCells",
            label: "Total Cells",
            valueType: { type: "integer" },
          },
          {
            id: "selectableCells",
            label: "Selectable Cells",
            valueType: { type: "integer" },
          },
          {
            id: "disabledUnique",
            label: "Disabled Unique",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communicationBoardCellSelectionCountTool.execute;
export default communicationBoardCellSelectionCountTool;
