import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly queryTime: number;
  readonly expiryTime: number;
  readonly includeExpiry: boolean;
  readonly clockKnown: boolean;
};
export type Output = {
  readonly known: boolean;
  readonly usableUnderClock: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queryTime: { type: "number" },
    expiryTime: { type: "number" },
    includeExpiry: { type: "boolean" },
    clockKnown: { type: "boolean" },
  },
  required: ["queryTime", "expiryTime", "includeExpiry", "clockKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "boolean" },
    usableUnderClock: { type: "boolean" },
  },
  required: ["known", "usableUnderClock"],
} as const;
/** Evaluate a supplied expiry boundary only when the caller asserts comparable clocks. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { queryTime, expiryTime, includeExpiry, clockKnown } = request;
  const compute = (): Output => {
    return {
      known: clockKnown,
      usableUnderClock:
        clockKnown &&
        (includeExpiry ? queryTime <= expiryTime : queryTime < expiryTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    queryTime: 100,
    expiryTime: 100,
    includeExpiry: false,
    clockKnown: true,
  },
  output: { known: true, usableUnderClock: false },
} satisfies ToolExample<Input, Output>;
export const voucherExpirySuppliedClockTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/voucher-expiry-supplied-clock-token",
    title: "Voucher Expiry Supplied Clock Token Tool",
    description:
      "Evaluate a supplied expiry boundary only when the caller asserts comparable clocks.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        queryTime: { type: "number" },
        expiryTime: { type: "number" },
        includeExpiry: { type: "boolean" },
        clockKnown: { type: "boolean" },
      },
      required: ["queryTime", "expiryTime", "includeExpiry", "clockKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        known: { type: "boolean" },
        usableUnderClock: { type: "boolean" },
      },
      required: ["known", "usableUnderClock"],
    },
    ports: {
      inputs: [
        {
          id: "queryTime",
          label: "Query Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expiryTime",
          label: "Expiry Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeExpiry",
          label: "Include Expiry",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "clockKnown",
          label: "Clock Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        {
          id: "usableUnderClock",
          label: "Usable Under Clock",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = voucherExpirySuppliedClockTokenTool.execute;
export default voucherExpirySuppliedClockTokenTool;
