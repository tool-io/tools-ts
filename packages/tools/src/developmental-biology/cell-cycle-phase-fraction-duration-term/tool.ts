import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positiveCells: number;
  readonly totalCells: number;
  readonly cycleDuration: number;
};
export type Output = {
  readonly fraction: number;
  readonly inferredDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveCells: { type: "integer", minimum: 0 },
    totalCells: { type: "integer", minimum: 1 },
    cycleDuration: { type: "number", minimum: 0 },
  },
  required: ["positiveCells", "totalCells", "cycleDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    inferredDuration: { type: "number" },
  },
  required: ["fraction", "inferredDuration"],
} as const;
/** Phase duration inferred from a supplied phase-cell fraction under an explicit uniform cell-age sampling approximation; exponentially growing asynchronous populations require an age-distribution correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { positiveCells, totalCells, cycleDuration } = request;
  const compute = (): Output => {
    H.integer(totalCells, 1);
    H.integer(positiveCells, 0, totalCells);
    H.domain(cycleDuration >= 0);
    return {
      fraction: positiveCells / totalCells,
      inferredDuration: (cycleDuration * positiveCells) / totalCells,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { positiveCells: 30, totalCells: 100, cycleDuration: 20 },
  output: { fraction: 0.3, inferredDuration: 6 },
} satisfies ToolExample<Input, Output>;
export const cellCyclePhaseFractionDurationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/cell-cycle-phase-fraction-duration-term",
    title: "Cell Cycle Phase Fraction Duration Term Tool",
    description:
      "Phase duration inferred from a supplied phase-cell fraction under an explicit uniform cell-age sampling approximation; exponentially growing asynchronous populations require an age-distribution correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveCells: { type: "integer", minimum: 0 },
        totalCells: { type: "integer", minimum: 1 },
        cycleDuration: { type: "number", minimum: 0 },
      },
      required: ["positiveCells", "totalCells", "cycleDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        inferredDuration: { type: "number" },
      },
      required: ["fraction", "inferredDuration"],
    },
    ports: {
      inputs: [
        {
          id: "positiveCells",
          label: "Positive Cells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalCells",
          label: "Total Cells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cycleDuration",
          label: "Cycle Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "inferredDuration",
          label: "Inferred Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cellCyclePhaseFractionDurationTermTool.execute;
export default cellCyclePhaseFractionDurationTermTool;
