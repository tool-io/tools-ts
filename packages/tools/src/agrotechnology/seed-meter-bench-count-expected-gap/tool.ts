import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cells: number;
  readonly revolutions: number;
  readonly fillFraction: number;
  readonly observed: number;
};
export type Output = { readonly expected: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cells: { type: "integer", minimum: 1 },
    revolutions: { type: "number", minimum: 0 },
    fillFraction: { type: "number", minimum: 0, maximum: 1 },
    observed: { type: "integer", minimum: 0 },
  },
  required: ["cells", "revolutions", "fillFraction", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expected: { type: "number" }, residual: { type: "number" } },
  required: ["expected", "residual"],
} as const;
/** Calculate seed meter bench count expected gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cells, revolutions, fillFraction, observed } = request;
  const compute = (): Output => {
    H.integer(cells, 1);
    H.integer(observed, 0);
    H.domain(revolutions >= 0);
    H.probability(fillFraction);
    return {
      expected: cells * revolutions * fillFraction,
      residual: observed - cells * revolutions * fillFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cells: 20, revolutions: 5, fillFraction: 0.9, observed: 88 },
  output: { expected: 90, residual: -2 },
} satisfies ToolExample<Input, Output>;
export const seedMeterBenchCountExpectedGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/seed-meter-bench-count-expected-gap",
    title: "Seed Meter Bench Count Expected Gap Tool",
    description:
      "Calculate seed meter bench count expected gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cells: { type: "integer", minimum: 1 },
        revolutions: { type: "number", minimum: 0 },
        fillFraction: { type: "number", minimum: 0, maximum: 1 },
        observed: { type: "integer", minimum: 0 },
      },
      required: ["cells", "revolutions", "fillFraction", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expected: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expected", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "cells",
          label: "Cells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "revolutions",
          label: "Revolutions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fillFraction",
          label: "Fill Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "expected", label: "Expected", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seedMeterBenchCountExpectedGapTool.execute;
export default seedMeterBenchCountExpectedGapTool;
