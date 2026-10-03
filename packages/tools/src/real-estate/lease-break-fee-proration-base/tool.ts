import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullFee: number;
  readonly remainingDays: number;
  readonly totalDays: number;
  readonly fixedComponent: number;
};
export type Output = { readonly prorated: number; readonly totalFee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullFee: { type: "number", minimum: 0 },
    remainingDays: { type: "integer", minimum: 0 },
    totalDays: { type: "integer", minimum: 1 },
    fixedComponent: { type: "number", minimum: 0 },
  },
  required: ["fullFee", "remainingDays", "totalDays", "fixedComponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { prorated: { type: "number" }, totalFee: { type: "number" } },
  required: ["prorated", "totalFee"],
} as const;
/** Supplied fixed and time-prorated lease fee components, without interpreting enforceability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullFee, remainingDays, totalDays, fixedComponent } = request;
  const compute = (): Output => {
    H.domain(fullFee >= 0 && fixedComponent >= 0);
    H.integer(totalDays, 1);
    H.integer(remainingDays, 0, totalDays);
    return {
      prorated: (fullFee * remainingDays) / totalDays,
      totalFee: fixedComponent + (fullFee * remainingDays) / totalDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fullFee: 1200,
    remainingDays: 90,
    totalDays: 360,
    fixedComponent: 100,
  },
  output: { prorated: 300, totalFee: 400 },
} satisfies ToolExample<Input, Output>;
export const leaseBreakFeeProrationBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/lease-break-fee-proration-base",
    title: "Lease Break Fee Proration Base Tool",
    description:
      "Supplied fixed and time-prorated lease fee components, without interpreting enforceability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullFee: { type: "number", minimum: 0 },
        remainingDays: { type: "integer", minimum: 0 },
        totalDays: { type: "integer", minimum: 1 },
        fixedComponent: { type: "number", minimum: 0 },
      },
      required: ["fullFee", "remainingDays", "totalDays", "fixedComponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prorated: { type: "number" },
        totalFee: { type: "number" },
      },
      required: ["prorated", "totalFee"],
    },
    ports: {
      inputs: [
        {
          id: "fullFee",
          label: "Full Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingDays",
          label: "Remaining Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalDays",
          label: "Total Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fixedComponent",
          label: "Fixed Component",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "prorated", label: "Prorated", valueType: { type: "number" } },
        { id: "totalFee", label: "Total Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = leaseBreakFeeProrationBaseTool.execute;
export default leaseBreakFeeProrationBaseTool;
