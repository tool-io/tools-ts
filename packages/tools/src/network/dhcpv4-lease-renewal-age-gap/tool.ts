import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly leaseSeconds: number;
  readonly renewalSeconds: number;
  readonly ageSeconds: number;
};
export type Output = {
  readonly renewalDue: boolean;
  readonly leaseExpired: boolean;
  readonly untilRenewal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leaseSeconds: { type: "integer", minimum: 1, maximum: 4294967295 },
    renewalSeconds: { type: "integer", minimum: 0 },
    ageSeconds: { type: "integer", minimum: 0 },
  },
  required: ["leaseSeconds", "renewalSeconds", "ageSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    renewalDue: { type: "boolean" },
    leaseExpired: { type: "boolean" },
    untilRenewal: { type: "integer" },
  },
  required: ["renewalDue", "leaseExpired", "untilRenewal"],
} as const;
/** Compute dhcpv4 lease renewal age gap from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leaseSeconds, renewalSeconds, ageSeconds } = input;
  const compute = (): Output => {
    integer(leaseSeconds, 1, 4294967295);
    integer(renewalSeconds, 0, leaseSeconds);
    integer(ageSeconds);
    return {
      renewalDue: ageSeconds >= renewalSeconds,
      leaseExpired: ageSeconds >= leaseSeconds,
      untilRenewal: Math.max(0, renewalSeconds - ageSeconds),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leaseSeconds: 3600, renewalSeconds: 1800, ageSeconds: 1200 },
  output: { renewalDue: false, leaseExpired: false, untilRenewal: 600 },
} satisfies ToolExample<Input, Output>;
export const dhcpv4LeaseRenewalAgeGapTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/dhcpv4-lease-renewal-age-gap",
  title: "Dhcpv4 Lease Renewal Age Gap Tool",
  description:
    "Compute dhcpv4 lease renewal age gap from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leaseSeconds",
        label: "Lease Seconds",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "renewalSeconds",
        label: "Renewal Seconds",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "ageSeconds",
        label: "Age Seconds",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "renewalDue",
        label: "Renewal Due",
        valueType: { type: "boolean" },
      },
      {
        id: "leaseExpired",
        label: "Lease Expired",
        valueType: { type: "boolean" },
      },
      {
        id: "untilRenewal",
        label: "Until Renewal",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = dhcpv4LeaseRenewalAgeGapTool.execute;
export default dhcpv4LeaseRenewalAgeGapTool;
