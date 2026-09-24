import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basis: string;
  readonly duration: number;
  readonly purchaseDay: number;
  readonly suppliedExpiryDay: number;
};
export type Output = {
  readonly nominalExpiryDay: number;
  readonly matchesSuppliedExpiry: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basis: {
      type: "string",
      maxLength: 8192,
      enum: ["elapsed-days", "caller-calendar"],
    },
    duration: { type: "integer", minimum: 0 },
    purchaseDay: { type: "integer" },
    suppliedExpiryDay: { type: "integer" },
  },
  required: ["basis", "duration", "purchaseDay", "suppliedExpiryDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalExpiryDay: { type: "integer" },
    matchesSuppliedExpiry: { type: "boolean" },
  },
  required: ["nominalExpiryDay", "matchesSuppliedExpiry"],
} as const;
/** Compare elapsed-day arithmetic with a caller-resolved calendar expiry, without interpreting warranty law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basis, duration, purchaseDay, suppliedExpiryDay } = request;
  const compute = (): Output => {
    H.domain(["elapsed-days", "caller-calendar"].includes(basis));
    H.integer(duration, 0);
    const nominalExpiryDay =
      basis === "elapsed-days" ? purchaseDay + duration : suppliedExpiryDay;
    return {
      nominalExpiryDay,
      matchesSuppliedExpiry: nominalExpiryDay === suppliedExpiryDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    basis: "elapsed-days",
    duration: 30,
    purchaseDay: 100,
    suppliedExpiryDay: 130,
  },
  output: { nominalExpiryDay: 130, matchesSuppliedExpiry: true },
} satisfies ToolExample<Input, Output>;
export const warrantyPeriodCalendarBasisTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "consumer-behavior/warranty-period-calendar-basis-token",
    title: "Warranty Period Calendar Basis Token Tool",
    description:
      "Compare elapsed-day arithmetic with a caller-resolved calendar expiry, without interpreting warranty law.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basis: {
          type: "string",
          maxLength: 8192,
          enum: ["elapsed-days", "caller-calendar"],
        },
        duration: { type: "integer", minimum: 0 },
        purchaseDay: { type: "integer" },
        suppliedExpiryDay: { type: "integer" },
      },
      required: ["basis", "duration", "purchaseDay", "suppliedExpiryDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalExpiryDay: { type: "integer" },
        matchesSuppliedExpiry: { type: "boolean" },
      },
      required: ["nominalExpiryDay", "matchesSuppliedExpiry"],
    },
    ports: {
      inputs: [
        {
          id: "basis",
          label: "Basis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "purchaseDay",
          label: "Purchase Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedExpiryDay",
          label: "Supplied Expiry Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nominalExpiryDay",
          label: "Nominal Expiry Day",
          valueType: { type: "integer" },
        },
        {
          id: "matchesSuppliedExpiry",
          label: "Matches Supplied Expiry",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = warrantyPeriodCalendarBasisTokenTool.execute;
export default warrantyPeriodCalendarBasisTokenTool;
