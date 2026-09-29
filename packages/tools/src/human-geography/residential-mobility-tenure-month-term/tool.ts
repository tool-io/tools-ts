import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moveInMonth: number;
  readonly observationMonth: number;
  readonly previousMoves: number;
  readonly exposureMonths: number;
};
export type Output = {
  readonly tenureMonths: number;
  readonly movesPerYear: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moveInMonth: { type: "integer" },
    observationMonth: { type: "integer" },
    previousMoves: { type: "integer", minimum: 0 },
    exposureMonths: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "moveInMonth",
    "observationMonth",
    "previousMoves",
    "exposureMonths",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tenureMonths: { type: "integer" },
    movesPerYear: { type: "number" },
  },
  required: ["tenureMonths", "movesPerYear"],
} as const;
/** Explicit month-coordinate tenure and prior-move exposure rate; months are ordinal coordinates, not fixed day durations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moveInMonth, observationMonth, previousMoves, exposureMonths } =
    request;
  const compute = (): Output => {
    H.domain(observationMonth >= moveInMonth);
    H.integer(previousMoves, 0);
    H.positive(exposureMonths);
    return {
      tenureMonths: observationMonth - moveInMonth,
      movesPerYear: (12 * previousMoves) / exposureMonths,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    moveInMonth: 100,
    observationMonth: 130,
    previousMoves: 3,
    exposureMonths: 60,
  },
  output: { tenureMonths: 30, movesPerYear: 0.6 },
} satisfies ToolExample<Input, Output>;
export const residentialMobilityTenureMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/residential-mobility-tenure-month-term",
    title: "Residential Mobility Tenure Month Term Tool",
    description:
      "Explicit month-coordinate tenure and prior-move exposure rate; months are ordinal coordinates, not fixed day durations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moveInMonth: { type: "integer" },
        observationMonth: { type: "integer" },
        previousMoves: { type: "integer", minimum: 0 },
        exposureMonths: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "moveInMonth",
        "observationMonth",
        "previousMoves",
        "exposureMonths",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tenureMonths: { type: "integer" },
        movesPerYear: { type: "number" },
      },
      required: ["tenureMonths", "movesPerYear"],
    },
    ports: {
      inputs: [
        {
          id: "moveInMonth",
          label: "Move In Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationMonth",
          label: "Observation Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "previousMoves",
          label: "Previous Moves",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exposureMonths",
          label: "Exposure Months",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tenureMonths",
          label: "Tenure Months",
          valueType: { type: "integer" },
        },
        {
          id: "movesPerYear",
          label: "Moves Per Year",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = residentialMobilityTenureMonthTermTool.execute;
export default residentialMobilityTenureMonthTermTool;
