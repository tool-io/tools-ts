import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contribution: number;
  readonly billingPeak: number;
  readonly charge: number;
};
export type Output = {
  readonly share: number;
  readonly allocatedCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contribution: { type: "number", minimum: 0 },
    billingPeak: { type: "number", exclusiveMinimum: 0 },
    charge: { type: "number", minimum: 0 },
  },
  required: ["contribution", "billingPeak", "charge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    share: { type: "number" },
    allocatedCharge: { type: "number" },
  },
  required: ["share", "allocatedCharge"],
} as const;
/** Calculate demand charge peak share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contribution, billingPeak, charge } = request;
  const compute = (): Output => {
    H.positive(billingPeak);
    H.domain(contribution >= 0 && contribution <= billingPeak && charge >= 0);
    return {
      share: contribution / billingPeak,
      allocatedCharge: (charge * contribution) / billingPeak,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contribution: 20, billingPeak: 100, charge: 500 },
  output: { share: 0.2, allocatedCharge: 100 },
} satisfies ToolExample<Input, Output>;
export const demandChargePeakShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/demand-charge-peak-share",
    title: "Demand Charge Peak Share Tool",
    description:
      "Calculate demand charge peak share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contribution: { type: "number", minimum: 0 },
        billingPeak: { type: "number", exclusiveMinimum: 0 },
        charge: { type: "number", minimum: 0 },
      },
      required: ["contribution", "billingPeak", "charge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        share: { type: "number" },
        allocatedCharge: { type: "number" },
      },
      required: ["share", "allocatedCharge"],
    },
    ports: {
      inputs: [
        {
          id: "contribution",
          label: "Contribution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "billingPeak",
          label: "Billing Peak",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "charge",
          label: "Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "allocatedCharge",
          label: "Allocated Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = demandChargePeakShareTool.execute;
export default demandChargePeakShareTool;
