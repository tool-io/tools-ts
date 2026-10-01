import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leaseSeconds: number;
  readonly t1: number;
  readonly t2: number;
};
export type Output = {
  readonly ordered: boolean;
  readonly renewalGap: number;
  readonly rebindGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leaseSeconds: { type: "integer", minimum: 1 },
    t1: { type: "integer", minimum: 0 },
    t2: { type: "integer", minimum: 0 },
  },
  required: ["leaseSeconds", "t1", "t2"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ordered: { type: "boolean" },
    renewalGap: { type: "integer" },
    rebindGap: { type: "integer" },
  },
  required: ["ordered", "renewalGap", "rebindGap"],
} as const;
/** Calculate dhcp lease t1 t2 order gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leaseSeconds, t1, t2 } = request;
  const compute = (): Output => {
    H.integer(leaseSeconds, 1);
    H.integer(t1, 0);
    H.integer(t2, 0);
    return {
      ordered: t1 < t2 && t2 < leaseSeconds,
      renewalGap: t2 - t1,
      rebindGap: leaseSeconds - t2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leaseSeconds: 3600, t1: 1800, t2: 3150 },
  output: { ordered: true, renewalGap: 1350, rebindGap: 450 },
} satisfies ToolExample<Input, Output>;
export const dhcpLeaseT1T2OrderGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/dhcp-lease-t1-t2-order-gap",
    title: "DHCP Lease T1 T2 Order Gap Tool",
    description:
      "Calculate dhcp lease t1 t2 order gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leaseSeconds: { type: "integer", minimum: 1 },
        t1: { type: "integer", minimum: 0 },
        t2: { type: "integer", minimum: 0 },
      },
      required: ["leaseSeconds", "t1", "t2"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ordered: { type: "boolean" },
        renewalGap: { type: "integer" },
        rebindGap: { type: "integer" },
      },
      required: ["ordered", "renewalGap", "rebindGap"],
    },
    ports: {
      inputs: [
        {
          id: "leaseSeconds",
          label: "Lease Seconds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "t1",
          label: "T1",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "t2",
          label: "T2",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
        {
          id: "renewalGap",
          label: "Renewal Gap",
          valueType: { type: "integer" },
        },
        {
          id: "rebindGap",
          label: "Rebind Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dhcpLeaseT1T2OrderGapTool.execute;
export default dhcpLeaseT1T2OrderGapTool;
