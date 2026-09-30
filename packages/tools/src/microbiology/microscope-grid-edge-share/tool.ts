import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rows: number;
  readonly columns: number;
  readonly includeCorners: boolean;
};
export type Output = {
  readonly totalCellsDecimal: string;
  readonly boundaryCellsDecimal: string;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
    includeCorners: { type: "boolean" },
  },
  required: ["rows", "columns", "includeCorners"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCellsDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    boundaryCellsDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    share: { type: "number" },
  },
  required: ["totalCellsDecimal", "boundaryCellsDecimal", "share"],
} as const;
/** Count edge cells on an explicit rectangular research grid, with a distinct-corner inclusion policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns, includeCorners } = request;
  const compute = (): Output => {
    H.integer(rows, 1);
    H.integer(columns, 1);
    return (() => {
      const r = BigInt(rows),
        c = BigInt(columns),
        total = r * c,
        boundary = total - (r > 2n ? r - 2n : 0n) * (c > 2n ? c - 2n : 0n),
        corners = r === 1n && c === 1n ? 1n : r === 1n || c === 1n ? 2n : 4n,
        selected = boundary - (includeCorners ? 0n : corners);
      return {
        totalCellsDecimal: total.toString(),
        boundaryCellsDecimal: selected.toString(),
        share: Number(selected) / Number(total),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rows: 3, columns: 4, includeCorners: true },
  output: {
    totalCellsDecimal: "12",
    boundaryCellsDecimal: "10",
    share: 0.8333333333333334,
  },
} satisfies ToolExample<Input, Output>;
export const microscopeGridEdgeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/microscope-grid-edge-share",
    title: "Microscope Grid Edge Share Tool",
    description:
      "Count edge cells on an explicit rectangular research grid, with a distinct-corner inclusion policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rows: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
        includeCorners: { type: "boolean" },
      },
      required: ["rows", "columns", "includeCorners"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCellsDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        boundaryCellsDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        share: { type: "number" },
      },
      required: ["totalCellsDecimal", "boundaryCellsDecimal", "share"],
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
          id: "includeCorners",
          label: "Include Corners",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "totalCellsDecimal",
          label: "Total Cells Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "boundaryCellsDecimal",
          label: "Boundary Cells Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = microscopeGridEdgeShareTool.execute;
export default microscopeGridEdgeShareTool;
