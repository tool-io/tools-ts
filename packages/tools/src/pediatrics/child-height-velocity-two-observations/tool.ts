import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstHeight: number;
  readonly secondHeight: number;
  readonly elapsedDays: number;
  readonly yearDays: number;
};
export type Output = {
  readonly heightChange: number;
  readonly perYear: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstHeight: { type: "number", minimum: 0 },
    secondHeight: { type: "number", minimum: 0 },
    elapsedDays: { type: "number", exclusiveMinimum: 0 },
    yearDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstHeight", "secondHeight", "elapsedDays", "yearDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heightChange: { type: "number" }, perYear: { type: "number" } },
  required: ["heightChange", "perYear"],
} as const;
/** Observed two-point research height velocity with an explicit annualization denominator, without a growth-chart percentile or diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstHeight, secondHeight, elapsedDays, yearDays } = request;
  const compute = (): Output => {
    H.domain(firstHeight >= 0 && secondHeight >= 0);
    H.positive(elapsedDays);
    H.positive(yearDays);
    return {
      heightChange: secondHeight - firstHeight,
      perYear: ((secondHeight - firstHeight) * yearDays) / elapsedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstHeight: 100,
    secondHeight: 103,
    elapsedDays: 180,
    yearDays: 360,
  },
  output: { heightChange: 3, perYear: 6 },
} satisfies ToolExample<Input, Output>;
export const childHeightVelocityTwoObservationsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/child-height-velocity-two-observations",
    title: "Child Height Velocity Two Observations Tool",
    description:
      "Observed two-point research height velocity with an explicit annualization denominator, without a growth-chart percentile or diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstHeight: { type: "number", minimum: 0 },
        secondHeight: { type: "number", minimum: 0 },
        elapsedDays: { type: "number", exclusiveMinimum: 0 },
        yearDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstHeight", "secondHeight", "elapsedDays", "yearDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heightChange: { type: "number" },
        perYear: { type: "number" },
      },
      required: ["heightChange", "perYear"],
    },
    ports: {
      inputs: [
        {
          id: "firstHeight",
          label: "First Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHeight",
          label: "Second Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yearDays",
          label: "Year Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightChange",
          label: "Height Change",
          valueType: { type: "number" },
        },
        { id: "perYear", label: "Per Year", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = childHeightVelocityTwoObservationsTool.execute;
export default childHeightVelocityTwoObservationsTool;
