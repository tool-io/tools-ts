import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredHectares: number;
  readonly billingIncrementHectares: number;
  readonly costPerBilledHectare: number;
};
export type Output = {
  readonly billedHectares: number;
  readonly extraHectares: number;
  readonly extraCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredHectares: { type: "number", minimum: 0 },
    billingIncrementHectares: { type: "number", exclusiveMinimum: 0 },
    costPerBilledHectare: { type: "number", minimum: 0 },
  },
  required: [
    "measuredHectares",
    "billingIncrementHectares",
    "costPerBilledHectare",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    billedHectares: { type: "number" },
    extraHectares: { type: "number" },
    extraCost: { type: "number" },
  },
  required: ["billedHectares", "extraHectares", "extraCost"],
} as const;
/** Describe the extra billed area and cost when measured hectares are rounded upward to an explicit billing increment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredHectares, billingIncrementHectares, costPerBilledHectare } =
    request;
  const compute = (): Output => {
    H.domain(
      measuredHectares >= 0 && costPerBilledHectare >= 0,
      "measuredHectares",
    );
    (H.domain(billingIncrementHectares > 0, "billingIncrementHectares"),
      billingIncrementHectares);
    return (() => {
      const billedHectares =
          Math.ceil(measuredHectares / billingIncrementHectares) *
          billingIncrementHectares,
        extraHectares = billedHectares - measuredHectares;
      return {
        billedHectares,
        extraHectares,
        extraCost: extraHectares * costPerBilledHectare,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredHectares: 2.3,
    billingIncrementHectares: 0.5,
    costPerBilledHectare: 100,
  },
  output: {
    billedHectares: 2.5,
    extraHectares: 0.20000000000000018,
    extraCost: 20.000000000000018,
  },
} satisfies ToolExample<Input, Output>;
export const cropAreaBillingRoundingCostDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/crop-area-billing-rounding-cost-delta",
    title: "Crop Area Billing Rounding Cost Delta",
    description:
      "Describe the extra billed area and cost when measured hectares are rounded upward to an explicit billing increment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredHectares: { type: "number", minimum: 0 },
        billingIncrementHectares: { type: "number", exclusiveMinimum: 0 },
        costPerBilledHectare: { type: "number", minimum: 0 },
      },
      required: [
        "measuredHectares",
        "billingIncrementHectares",
        "costPerBilledHectare",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        billedHectares: { type: "number" },
        extraHectares: { type: "number" },
        extraCost: { type: "number" },
      },
      required: ["billedHectares", "extraHectares", "extraCost"],
    },
    ports: {
      inputs: [
        {
          id: "measuredHectares",
          label: "Measured Hectares",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "billingIncrementHectares",
          label: "Billing Increment Hectares",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "costPerBilledHectare",
          label: "Cost Per Billed Hectare",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "billedHectares",
          label: "Billed Hectares",
          valueType: { type: "number" },
        },
        {
          id: "extraHectares",
          label: "Extra Hectares",
          valueType: { type: "number" },
        },
        { id: "extraCost", label: "Extra Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cropAreaBillingRoundingCostDeltaTool.execute;
export default cropAreaBillingRoundingCostDeltaTool;
