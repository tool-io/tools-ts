import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualFee: number;
  readonly occupiedDays: number;
  readonly yearDays: number;
  readonly discount: number;
};
export type Output = { readonly proratedFee: number; readonly netFee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualFee: { type: "number", minimum: 0 },
    occupiedDays: { type: "integer", minimum: 0 },
    yearDays: { type: "integer", minimum: 1 },
    discount: { type: "number", minimum: 0 },
  },
  required: ["annualFee", "occupiedDays", "yearDays", "discount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { proratedFee: { type: "number" }, netFee: { type: "number" } },
  required: ["proratedFee", "netFee"],
} as const;
/** Calculate community garden plot fee proration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annualFee, occupiedDays, yearDays, discount } = request;
  const compute = (): Output => {
    H.integer(yearDays, 1);
    H.integer(occupiedDays, 0, yearDays);
    H.domain(annualFee >= 0 && discount >= 0);
    return {
      proratedFee: (annualFee * occupiedDays) / yearDays,
      netFee: (annualFee * occupiedDays) / yearDays - discount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { annualFee: 365, occupiedDays: 180, yearDays: 365, discount: 20 },
  output: { proratedFee: 180, netFee: 160 },
} satisfies ToolExample<Input, Output>;
export const communityGardenPlotFeeProrationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/community-garden-plot-fee-proration",
    title: "Community Garden Plot Fee Proration Tool",
    description:
      "Calculate community garden plot fee proration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annualFee: { type: "number", minimum: 0 },
        occupiedDays: { type: "integer", minimum: 0 },
        yearDays: { type: "integer", minimum: 1 },
        discount: { type: "number", minimum: 0 },
      },
      required: ["annualFee", "occupiedDays", "yearDays", "discount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proratedFee: { type: "number" },
        netFee: { type: "number" },
      },
      required: ["proratedFee", "netFee"],
    },
    ports: {
      inputs: [
        {
          id: "annualFee",
          label: "Annual Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupiedDays",
          label: "Occupied Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "yearDays",
          label: "Year Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "discount",
          label: "Discount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "proratedFee",
          label: "Prorated Fee",
          valueType: { type: "number" },
        },
        { id: "netFee", label: "Net Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = communityGardenPlotFeeProrationTool.execute;
export default communityGardenPlotFeeProrationTool;
