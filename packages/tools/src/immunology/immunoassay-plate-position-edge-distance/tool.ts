import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly rows: number;
  readonly columns: number;
};
export type Output = {
  readonly edgeDistance: number;
  readonly edgeWell: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
  },
  required: ["row", "column", "rows", "columns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeDistance: { type: "integer" },
    edgeWell: { type: "boolean" },
  },
  required: ["edgeDistance", "edgeWell"],
} as const;
/** Zero-based rectangular plate edge distance in well steps, without an assay edge-effect model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, rows, columns } = request;
  const compute = (): Output => {
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.integer(row, 0, rows - 1);
    H.integer(column, 0, columns - 1);
    return {
      edgeDistance: Math.min(row, column, rows - 1 - row, columns - 1 - column),
      edgeWell:
        row === 0 || column === 0 || row === rows - 1 || column === columns - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: 2, column: 3, rows: 8, columns: 12 },
  output: { edgeDistance: 2, edgeWell: false },
} satisfies ToolExample<Input, Output>;
export const immunoassayPlatePositionEdgeDistanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/immunoassay-plate-position-edge-distance",
      title: "Immunoassay Plate Position Edge Distance Tool",
      description:
        "Zero-based rectangular plate edge distance in well steps, without an assay edge-effect model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          row: { type: "integer", minimum: 0 },
          column: { type: "integer", minimum: 0 },
          rows: { type: "integer", minimum: 1 },
          columns: { type: "integer", minimum: 1 },
        },
        required: ["row", "column", "rows", "columns"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          edgeDistance: { type: "integer" },
          edgeWell: { type: "boolean" },
        },
        required: ["edgeDistance", "edgeWell"],
      },
      ports: {
        inputs: [
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
        ],
        outputs: [
          {
            id: "edgeDistance",
            label: "Edge Distance",
            valueType: { type: "integer" },
          },
          {
            id: "edgeWell",
            label: "Edge Well",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = immunoassayPlatePositionEdgeDistanceTool.execute;
export default immunoassayPlatePositionEdgeDistanceTool;
