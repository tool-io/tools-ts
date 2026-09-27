import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly principal: number;
  readonly referenceRate: number;
  readonly margin: number;
  readonly suppliedFloor: number;
  readonly yearFraction: number;
};
export type Output = {
  readonly unflooredRate: number;
  readonly appliedRate: number;
  readonly interest: number;
  readonly floorIncrement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    principal: { type: "number", minimum: 0 },
    referenceRate: { type: "number" },
    margin: { type: "number" },
    suppliedFloor: { type: "number" },
    yearFraction: { type: "number", minimum: 0 },
  },
  required: [
    "principal",
    "referenceRate",
    "margin",
    "suppliedFloor",
    "yearFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unflooredRate: { type: "number" },
    appliedRate: { type: "number" },
    interest: { type: "number" },
    floorIncrement: { type: "number" },
  },
  required: ["unflooredRate", "appliedRate", "interest", "floorIncrement"],
} as const;
/** One simple-interest reset slice with a supplied floor applied to the all-in rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { principal, referenceRate, margin, suppliedFloor, yearFraction } =
    request;
  const compute = (): Output => {
    H.domain(principal >= 0 && yearFraction >= 0);
    return {
      unflooredRate: referenceRate + margin,
      appliedRate: Math.max(referenceRate + margin, suppliedFloor),
      interest:
        principal *
        Math.max(referenceRate + margin, suppliedFloor) *
        yearFraction,
      floorIncrement:
        principal *
        Math.max(0, suppliedFloor - referenceRate - margin) *
        yearFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    principal: 1000,
    referenceRate: 0.01,
    margin: 0.02,
    suppliedFloor: 0.04,
    yearFraction: 0.5,
  },
  output: {
    unflooredRate: 0.03,
    appliedRate: 0.04,
    interest: 20,
    floorIncrement: 4.999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const loanRateFloorResetSliceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/loan-rate-floor-reset-slice",
    title: "Loan Rate Floor Reset Slice Tool",
    description:
      "One simple-interest reset slice with a supplied floor applied to the all-in rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        principal: { type: "number", minimum: 0 },
        referenceRate: { type: "number" },
        margin: { type: "number" },
        suppliedFloor: { type: "number" },
        yearFraction: { type: "number", minimum: 0 },
      },
      required: [
        "principal",
        "referenceRate",
        "margin",
        "suppliedFloor",
        "yearFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unflooredRate: { type: "number" },
        appliedRate: { type: "number" },
        interest: { type: "number" },
        floorIncrement: { type: "number" },
      },
      required: ["unflooredRate", "appliedRate", "interest", "floorIncrement"],
    },
    ports: {
      inputs: [
        {
          id: "principal",
          label: "Principal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceRate",
          label: "Reference Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "margin",
          label: "Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFloor",
          label: "Supplied Floor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yearFraction",
          label: "Year Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "unflooredRate",
          label: "Unfloored Rate",
          valueType: { type: "number" },
        },
        {
          id: "appliedRate",
          label: "Applied Rate",
          valueType: { type: "number" },
        },
        { id: "interest", label: "Interest", valueType: { type: "number" } },
        {
          id: "floorIncrement",
          label: "Floor Increment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = loanRateFloorResetSliceTool.execute;
export default loanRateFloorResetSliceTool;
