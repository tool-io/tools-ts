import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly column: number;
  readonly row: number;
  readonly xOrigin: number;
  readonly yOrigin: number;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly rowDirection: string;
};
export type Output = { readonly centerX: number; readonly centerY: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    column: { type: "integer", minimum: 0 },
    row: { type: "integer", minimum: 0 },
    xOrigin: { type: "number" },
    yOrigin: { type: "number" },
    cellWidth: { type: "number", exclusiveMinimum: 0 },
    cellHeight: { type: "number", exclusiveMinimum: 0 },
    rowDirection: { type: "string", maxLength: 8192, enum: ["up", "down"] },
  },
  required: [
    "column",
    "row",
    "xOrigin",
    "yOrigin",
    "cellWidth",
    "cellHeight",
    "rowDirection",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { centerX: { type: "number" }, centerY: { type: "number" } },
  required: ["centerX", "centerY"],
} as const;
/** Cell center from an upper/lower boundary origin with explicit row-axis direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { column, row, xOrigin, yOrigin, cellWidth, cellHeight, rowDirection } =
    request;
  const compute = (): Output => {
    H.integer(column, 0);
    H.integer(row, 0);
    H.positive(cellWidth);
    H.positive(cellHeight);
    H.domain(["up", "down"].includes(rowDirection));
    return {
      centerX: xOrigin + (column + 0.5) * cellWidth,
      centerY:
        yOrigin + (rowDirection === "down" ? -1 : 1) * (row + 0.5) * cellHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    column: 0,
    row: 1,
    xOrigin: 100,
    yOrigin: 200,
    cellWidth: 10,
    cellHeight: 20,
    rowDirection: "down",
  },
  output: { centerX: 105, centerY: 170 },
} satisfies ToolExample<Input, Output>;
export const mapGridCellOriginSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/map-grid-cell-origin-sign",
    title: "Map Grid Cell Origin Sign Tool",
    description:
      "Cell center from an upper/lower boundary origin with explicit row-axis direction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        column: { type: "integer", minimum: 0 },
        row: { type: "integer", minimum: 0 },
        xOrigin: { type: "number" },
        yOrigin: { type: "number" },
        cellWidth: { type: "number", exclusiveMinimum: 0 },
        cellHeight: { type: "number", exclusiveMinimum: 0 },
        rowDirection: { type: "string", maxLength: 8192, enum: ["up", "down"] },
      },
      required: [
        "column",
        "row",
        "xOrigin",
        "yOrigin",
        "cellWidth",
        "cellHeight",
        "rowDirection",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { centerX: { type: "number" }, centerY: { type: "number" } },
      required: ["centerX", "centerY"],
    },
    ports: {
      inputs: [
        {
          id: "column",
          label: "Column",
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
          id: "xOrigin",
          label: "X Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yOrigin",
          label: "Y Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellWidth",
          label: "Cell Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellHeight",
          label: "Cell Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rowDirection",
          label: "Row Direction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "centerX", label: "Center X", valueType: { type: "number" } },
        { id: "centerY", label: "Center Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mapGridCellOriginSignTool.execute;
export default mapGridCellOriginSignTool;
