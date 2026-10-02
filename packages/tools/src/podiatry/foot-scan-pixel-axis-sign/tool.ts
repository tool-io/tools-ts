import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly rowScale: number;
  readonly columnScale: number;
  readonly reverseRows: boolean;
  readonly reverseColumns: boolean;
};
export type Output = { readonly x: number; readonly y: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "number" },
    column: { type: "number" },
    rowScale: { type: "number", exclusiveMinimum: 0 },
    columnScale: { type: "number", exclusiveMinimum: 0 },
    reverseRows: { type: "boolean" },
    reverseColumns: { type: "boolean" },
  },
  required: [
    "row",
    "column",
    "rowScale",
    "columnScale",
    "reverseRows",
    "reverseColumns",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
} as const;
/** Convert supplied pixel displacements using explicit axis scales and signs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, rowScale, columnScale, reverseRows, reverseColumns } =
    request;
  const compute = (): Output => {
    H.positive(rowScale);
    H.positive(columnScale);
    return {
      x: column * columnScale * (reverseColumns ? -1 : 1),
      y: row * rowScale * (reverseRows ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    row: 2,
    column: 3,
    rowScale: 0.5,
    columnScale: 2,
    reverseRows: true,
    reverseColumns: false,
  },
  output: { x: 6, y: -1 },
} satisfies ToolExample<Input, Output>;
export const footScanPixelAxisSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/foot-scan-pixel-axis-sign",
    title: "Foot Scan Pixel Axis Sign Tool",
    description:
      "Convert supplied pixel displacements using explicit axis scales and signs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "number" },
        column: { type: "number" },
        rowScale: { type: "number", exclusiveMinimum: 0 },
        columnScale: { type: "number", exclusiveMinimum: 0 },
        reverseRows: { type: "boolean" },
        reverseColumns: { type: "boolean" },
      },
      required: [
        "row",
        "column",
        "rowScale",
        "columnScale",
        "reverseRows",
        "reverseColumns",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" }, y: { type: "number" } },
      required: ["x", "y"],
    },
    ports: {
      inputs: [
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rowScale",
          label: "Row Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnScale",
          label: "Column Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseRows",
          label: "Reverse Rows",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reverseColumns",
          label: "Reverse Columns",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "x", label: "X", valueType: { type: "number" } },
        { id: "y", label: "Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = footScanPixelAxisSignTool.execute;
export default footScanPixelAxisSignTool;
