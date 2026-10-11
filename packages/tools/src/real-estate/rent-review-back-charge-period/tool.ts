import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldPeriodicRent: number;
  readonly revisedPeriodicRent: number;
  readonly suppliedPeriods: number;
};
export type Output = {
  readonly periodicDifference: number;
  readonly backCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldPeriodicRent: { type: "number", minimum: 0 },
    revisedPeriodicRent: { type: "number", minimum: 0 },
    suppliedPeriods: { type: "number", minimum: 0 },
  },
  required: ["oldPeriodicRent", "revisedPeriodicRent", "suppliedPeriods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodicDifference: { type: "number" },
    backCharge: { type: "number" },
  },
  required: ["periodicDifference", "backCharge"],
} as const;
/** Apply an explicit periodic rent difference over supplied periods without deciding enforceability or retroactive lease terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldPeriodicRent, revisedPeriodicRent, suppliedPeriods } = request;
  const compute = (): Output => {
    H.domain(
      oldPeriodicRent >= 0 && revisedPeriodicRent >= 0 && suppliedPeriods >= 0,
      "oldPeriodicRent",
    );
    return {
      periodicDifference: revisedPeriodicRent - oldPeriodicRent,
      backCharge: (revisedPeriodicRent - oldPeriodicRent) * suppliedPeriods,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oldPeriodicRent: 1000,
    revisedPeriodicRent: 1100,
    suppliedPeriods: 3,
  },
  output: { periodicDifference: 100, backCharge: 300 },
} satisfies ToolExample<Input, Output>;
export const rentReviewBackChargePeriodTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/rent-review-back-charge-period",
    title: "Rent Review Back Charge Period",
    description:
      "Apply an explicit periodic rent difference over supplied periods without deciding enforceability or retroactive lease terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldPeriodicRent: { type: "number", minimum: 0 },
        revisedPeriodicRent: { type: "number", minimum: 0 },
        suppliedPeriods: { type: "number", minimum: 0 },
      },
      required: ["oldPeriodicRent", "revisedPeriodicRent", "suppliedPeriods"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodicDifference: { type: "number" },
        backCharge: { type: "number" },
      },
      required: ["periodicDifference", "backCharge"],
    },
    ports: {
      inputs: [
        {
          id: "oldPeriodicRent",
          label: "Old Periodic Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "revisedPeriodicRent",
          label: "Revised Periodic Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPeriods",
          label: "Supplied Periods",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "periodicDifference",
          label: "Periodic Difference",
          valueType: { type: "number" },
        },
        {
          id: "backCharge",
          label: "Back Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rentReviewBackChargePeriodTool.execute;
export default rentReviewBackChargePeriodTool;
