import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rows: number;
  readonly columns: number;
  readonly row: number;
  readonly column: number;
  readonly origin: number;
};
export type Output = {
  readonly edgeDistance: number;
  readonly onEdge: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
    row: { type: "integer" },
    column: { type: "integer" },
    origin: { type: "integer" },
  },
  required: ["rows", "columns", "row", "column", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeDistance: { type: "integer" },
    onEdge: { type: "boolean" },
  },
  required: ["edgeDistance", "onEdge"],
} as const;
/** Calculate plate control edge distance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns, row, column, origin } = request;
  const compute = (): Output => {
    H.domain(origin === 0 || origin === 1);
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.integer(row, origin, origin + rows - 1);
    H.integer(column, origin, origin + columns - 1);
    return (() => {
      const edgeDistance = Math.min(
        row - origin,
        column - origin,
        origin + rows - 1 - row,
        origin + columns - 1 - column,
      );
      return { edgeDistance, onEdge: edgeDistance === 0 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rows: 8, columns: 12, row: 3, column: 4, origin: 1 },
  output: { edgeDistance: 2, onEdge: false },
} satisfies ToolExample<Input, Output>;
export const plateControlEdgeDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/plate-control-edge-distance",
    title: "Plate Control Edge Distance Tool",
    description:
      "Calculate plate control edge distance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rows: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
        row: { type: "integer" },
        column: { type: "integer" },
        origin: { type: "integer" },
      },
      required: ["rows", "columns", "row", "column", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeDistance: { type: "integer" },
        onEdge: { type: "boolean" },
      },
      required: ["edgeDistance", "onEdge"],
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
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "edgeDistance",
          label: "Edge Distance",
          valueType: { type: "integer" },
        },
        { id: "onEdge", label: "On Edge", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = plateControlEdgeDistanceTool.execute;
export default plateControlEdgeDistanceTool;
