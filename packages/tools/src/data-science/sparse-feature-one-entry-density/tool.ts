import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rows: number;
  readonly columns: number;
  readonly nonzero: number;
  readonly additionalNonzero: number;
};
export type Output = {
  readonly density: number;
  readonly nextDensity: number;
  readonly remainingZeros: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
    nonzero: { type: "integer", minimum: 0 },
    additionalNonzero: { type: "integer", minimum: 0 },
  },
  required: ["rows", "columns", "nonzero", "additionalNonzero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    density: { type: "number" },
    nextDensity: { type: "number" },
    remainingZeros: { type: "integer" },
  },
  required: ["density", "nextDensity", "remainingZeros"],
} as const;
/** Calculate sparse feature one entry density from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns, nonzero, additionalNonzero } = request;
  const compute = (): Output => {
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.integer(nonzero, 0, rows * columns);
    H.integer(additionalNonzero, 0, rows * columns - nonzero);
    return {
      density: nonzero / (rows * columns),
      nextDensity: (nonzero + additionalNonzero) / (rows * columns),
      remainingZeros: rows * columns - nonzero - additionalNonzero,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rows: 10, columns: 20, nonzero: 20, additionalNonzero: 1 },
  output: { density: 0.1, nextDensity: 0.105, remainingZeros: 179 },
} satisfies ToolExample<Input, Output>;
export const sparseFeatureOneEntryDensityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/sparse-feature-one-entry-density",
    title: "Sparse Feature One Entry Density Tool",
    description:
      "Calculate sparse feature one entry density from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rows: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
        nonzero: { type: "integer", minimum: 0 },
        additionalNonzero: { type: "integer", minimum: 0 },
      },
      required: ["rows", "columns", "nonzero", "additionalNonzero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        density: { type: "number" },
        nextDensity: { type: "number" },
        remainingZeros: { type: "integer" },
      },
      required: ["density", "nextDensity", "remainingZeros"],
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
          id: "nonzero",
          label: "Nonzero",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "additionalNonzero",
          label: "Additional Nonzero",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "density", label: "Density", valueType: { type: "number" } },
        {
          id: "nextDensity",
          label: "Next Density",
          valueType: { type: "number" },
        },
        {
          id: "remainingZeros",
          label: "Remaining Zeros",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sparseFeatureOneEntryDensityTool.execute;
export default sparseFeatureOneEntryDensityTool;
