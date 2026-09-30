import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly row: number;
  readonly column: number;
  readonly bandwidth: number;
};
export type Output = {
  readonly stored: boolean;
  readonly bandRow: number;
  readonly storageColumn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    bandwidth: { type: "integer", minimum: 0 },
  },
  required: ["row", "column", "bandwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stored: { type: "boolean" },
    bandRow: { type: "integer" },
    storageColumn: { type: "integer" },
  },
  required: ["stored", "bandRow", "storageColumn"],
} as const;
/** Compute matrix symmetric band storage offset from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, column, bandwidth } = input;
  const compute = (): Output => {
    integer(row);
    integer(column);
    integer(bandwidth);
    const distance = column - row,
      stored = distance >= 0 && distance <= bandwidth;
    return {
      stored,
      bandRow: stored ? bandwidth - distance : -1,
      storageColumn: column,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: 2, column: 4, bandwidth: 3 },
  output: { stored: true, bandRow: 1, storageColumn: 4 },
} satisfies ToolExample<Input, Output>;
export const matrixSymmetricBandStorageOffsetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-symmetric-band-storage-offset",
  title: "Matrix Symmetric Band Storage Offset Tool",
  description:
    "Compute matrix symmetric band storage offset from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
        id: "bandwidth",
        label: "Bandwidth",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "stored", label: "Stored", valueType: { type: "boolean" } },
      { id: "bandRow", label: "Band Row", valueType: { type: "integer" } },
      {
        id: "storageColumn",
        label: "Storage Column",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = matrixSymmetricBandStorageOffsetTool.execute;
export default matrixSymmetricBandStorageOffsetTool;
