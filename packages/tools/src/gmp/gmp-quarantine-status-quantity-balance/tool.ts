import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly received: number;
  readonly released: number;
  readonly rejected: number;
  readonly sampled: number;
  readonly pending: number;
};
export type Output = {
  readonly quarantined: number;
  readonly accounted: number;
  readonly discrepancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    received: { type: "integer", minimum: 0 },
    released: { type: "integer", minimum: 0 },
    rejected: { type: "integer", minimum: 0 },
    sampled: { type: "integer", minimum: 0 },
    pending: { type: "integer", minimum: 0 },
  },
  required: ["received", "released", "rejected", "sampled", "pending"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quarantined: { type: "integer" },
    accounted: { type: "integer" },
    discrepancy: { type: "integer" },
  },
  required: ["quarantined", "accounted", "discrepancy"],
} as const;
/** Calculate gmp quarantine status quantity balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { received, released, rejected, sampled, pending } = request;
  const compute = (): Output => {
    H.integer(received, 0);
    H.integer(released, 0);
    H.integer(rejected, 0);
    H.integer(sampled, 0);
    H.integer(pending, 0);
    H.domain(released + rejected + sampled <= received);
    return {
      quarantined: received - released - rejected - sampled,
      accounted: released + rejected + sampled + pending,
      discrepancy: received - released - rejected - sampled - pending,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { received: 100, released: 60, rejected: 10, sampled: 5, pending: 20 },
  output: { quarantined: 25, accounted: 95, discrepancy: 5 },
} satisfies ToolExample<Input, Output>;
export const gmpQuarantineStatusQuantityBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-quarantine-status-quantity-balance",
    title: "GMP Quarantine Status Quantity Balance Tool",
    description:
      "Calculate gmp quarantine status quantity balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        received: { type: "integer", minimum: 0 },
        released: { type: "integer", minimum: 0 },
        rejected: { type: "integer", minimum: 0 },
        sampled: { type: "integer", minimum: 0 },
        pending: { type: "integer", minimum: 0 },
      },
      required: ["received", "released", "rejected", "sampled", "pending"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quarantined: { type: "integer" },
        accounted: { type: "integer" },
        discrepancy: { type: "integer" },
      },
      required: ["quarantined", "accounted", "discrepancy"],
    },
    ports: {
      inputs: [
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "released",
          label: "Released",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rejected",
          label: "Rejected",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampled",
          label: "Sampled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pending",
          label: "Pending",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "quarantined",
          label: "Quarantined",
          valueType: { type: "integer" },
        },
        { id: "accounted", label: "Accounted", valueType: { type: "integer" } },
        {
          id: "discrepancy",
          label: "Discrepancy",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpQuarantineStatusQuantityBalanceTool.execute;
export default gmpQuarantineStatusQuantityBalanceTool;
