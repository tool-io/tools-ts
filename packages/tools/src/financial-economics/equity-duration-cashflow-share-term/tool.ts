import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashflowPresentValue: number;
  readonly totalPresentValue: number;
  readonly years: number;
};
export type Output = {
  readonly presentValueWeight: number;
  readonly durationContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashflowPresentValue: { type: "number" },
    totalPresentValue: { type: "number", exclusiveMinimum: 0 },
    years: { type: "number", minimum: 0 },
  },
  required: ["cashflowPresentValue", "totalPresentValue", "years"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentValueWeight: { type: "number" },
    durationContribution: { type: "number" },
  },
  required: ["presentValueWeight", "durationContribution"],
} as const;
/** One time-weighted PV contribution using an explicit denominator; negative individual cash flows remain allowed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashflowPresentValue, totalPresentValue, years } = request;
  const compute = (): Output => {
    H.positive(totalPresentValue);
    H.domain(years >= 0);
    return {
      presentValueWeight: cashflowPresentValue / totalPresentValue,
      durationContribution: (years * cashflowPresentValue) / totalPresentValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashflowPresentValue: 20, totalPresentValue: 100, years: 5 },
  output: { presentValueWeight: 0.2, durationContribution: 1 },
} satisfies ToolExample<Input, Output>;
export const equityDurationCashflowShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/equity-duration-cashflow-share-term",
    title: "Equity Duration Cashflow Share Term Tool",
    description:
      "One time-weighted PV contribution using an explicit denominator; negative individual cash flows remain allowed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashflowPresentValue: { type: "number" },
        totalPresentValue: { type: "number", exclusiveMinimum: 0 },
        years: { type: "number", minimum: 0 },
      },
      required: ["cashflowPresentValue", "totalPresentValue", "years"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentValueWeight: { type: "number" },
        durationContribution: { type: "number" },
      },
      required: ["presentValueWeight", "durationContribution"],
    },
    ports: {
      inputs: [
        {
          id: "cashflowPresentValue",
          label: "Cashflow Present Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPresentValue",
          label: "Total Present Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "presentValueWeight",
          label: "Present Value Weight",
          valueType: { type: "number" },
        },
        {
          id: "durationContribution",
          label: "Duration Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = equityDurationCashflowShareTermTool.execute;
export default equityDurationCashflowShareTermTool;
