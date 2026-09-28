import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualRate: number;
  readonly cycleYears: number;
  readonly cycleIndex: number;
  readonly useMidpoint: boolean;
};
export type Output = { readonly elapsedYears: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualRate: { type: "number", exclusiveMinimum: -1 },
    cycleYears: { type: "number", minimum: 0 },
    cycleIndex: { type: "integer", minimum: 0 },
    useMidpoint: { type: "boolean" },
  },
  required: ["annualRate", "cycleYears", "cycleIndex", "useMidpoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedYears: { type: "number" }, factor: { type: "number" } },
  required: ["elapsedYears", "factor"],
} as const;
/** Discount one supplied cycle’s midpoint or end time under a constant annual effective rate; no clinical model or recommended discount rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annualRate, cycleYears, cycleIndex, useMidpoint } = request;
  const compute = (): Output => {
    H.domain(annualRate > -1 && cycleYears >= 0);
    H.integer(cycleIndex, 0);
    return {
      elapsedYears: (cycleIndex + (useMidpoint ? 0.5 : 1)) * cycleYears,
      factor:
        (1 + annualRate) **
        (-(cycleIndex + (useMidpoint ? 0.5 : 1)) * cycleYears),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { annualRate: 0.04, cycleYears: 1, cycleIndex: 0, useMidpoint: true },
  output: { elapsedYears: 0.5, factor: 0.9805806756909201 },
} satisfies ToolExample<Input, Output>;
export const discountTimingHalfCycleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/discount-timing-half-cycle-factor",
    title: "Discount Timing Half Cycle Factor Tool",
    description:
      "Discount one supplied cycle’s midpoint or end time under a constant annual effective rate; no clinical model or recommended discount rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annualRate: { type: "number", exclusiveMinimum: -1 },
        cycleYears: { type: "number", minimum: 0 },
        cycleIndex: { type: "integer", minimum: 0 },
        useMidpoint: { type: "boolean" },
      },
      required: ["annualRate", "cycleYears", "cycleIndex", "useMidpoint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedYears: { type: "number" },
        factor: { type: "number" },
      },
      required: ["elapsedYears", "factor"],
    },
    ports: {
      inputs: [
        {
          id: "annualRate",
          label: "Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleYears",
          label: "Cycle Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleIndex",
          label: "Cycle Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useMidpoint",
          label: "Use Midpoint",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "elapsedYears",
          label: "Elapsed Years",
          valueType: { type: "number" },
        },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = discountTimingHalfCycleFactorTool.execute;
export default discountTimingHalfCycleFactorTool;
