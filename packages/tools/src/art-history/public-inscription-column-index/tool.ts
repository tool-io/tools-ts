import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly columns: number;
  readonly origin: number;
};
export type Output = { readonly linearIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer" },
    column: { type: "integer" },
    columns: { type: "integer", minimum: 1 },
    origin: { type: "integer" },
  },
  required: ["row", "column", "columns", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { linearIndex: { type: "integer" } },
  required: ["linearIndex"],
} as const;
/** Index an explicit public-inscription transcription grid in row-major zero-based output order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, columns, origin } = request;
  const compute = (): Output => {
    H.domain(origin === 0 || origin === 1);
    H.integer(columns, 1);
    H.integer(row, origin);
    H.integer(column, origin, origin + columns - 1);
    return {
      linearIndex: Number(
        BigInt(row - origin) * BigInt(columns) + BigInt(column - origin),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: 2, column: 3, columns: 4, origin: 1 },
  output: { linearIndex: 6 },
} satisfies ToolExample<Input, Output>;
export const publicInscriptionColumnIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/public-inscription-column-index",
    title: "Public Inscription Column Index Tool",
    description:
      "Index an explicit public-inscription transcription grid in row-major zero-based output order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer" },
        column: { type: "integer" },
        columns: { type: "integer", minimum: 1 },
        origin: { type: "integer" },
      },
      required: ["row", "column", "columns", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { linearIndex: { type: "integer" } },
      required: ["linearIndex"],
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
          id: "columns",
          label: "Columns",
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
          id: "linearIndex",
          label: "Linear Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicInscriptionColumnIndexTool.execute;
export default publicInscriptionColumnIndexTool;
