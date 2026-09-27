import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly received: number;
  readonly assigned: number;
  readonly returned: number;
  readonly destroyed: number;
  readonly dispensed: number;
};
export type Output = {
  readonly unassigned: number;
  readonly heldAssigned: number;
  readonly accounted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    received: { type: "integer", minimum: 0 },
    assigned: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    destroyed: { type: "integer", minimum: 0 },
    dispensed: { type: "integer", minimum: 0 },
  },
  required: ["received", "assigned", "returned", "destroyed", "dispensed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unassigned: { type: "integer" },
    heldAssigned: { type: "integer" },
    accounted: { type: "integer" },
  },
  required: ["unassigned", "heldAssigned", "accounted"],
} as const;
/** Calculate gcp trial material receipt return balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { received, assigned, returned, destroyed, dispensed } = request;
  const compute = (): Output => {
    H.integer(received, 0);
    H.integer(assigned, 0, received);
    H.integer(dispensed, 0, assigned);
    H.integer(returned, 0, dispensed);
    H.integer(destroyed, 0, assigned - dispensed + returned);
    return {
      unassigned: received - assigned,
      heldAssigned: assigned - dispensed + returned - destroyed,
      accounted:
        dispensed -
        returned +
        destroyed +
        assigned -
        dispensed +
        returned -
        destroyed +
        received -
        assigned,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    received: 100,
    assigned: 80,
    returned: 5,
    destroyed: 10,
    dispensed: 60,
  },
  output: { unassigned: 20, heldAssigned: 15, accounted: 100 },
} satisfies ToolExample<Input, Output>;
export const gcpTrialMaterialReceiptReturnBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gcp/gcp-trial-material-receipt-return-balance",
      title: "GCP Trial Material Receipt Return Balance Tool",
      description:
        "Calculate gcp trial material receipt return balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          received: { type: "integer", minimum: 0 },
          assigned: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          destroyed: { type: "integer", minimum: 0 },
          dispensed: { type: "integer", minimum: 0 },
        },
        required: [
          "received",
          "assigned",
          "returned",
          "destroyed",
          "dispensed",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unassigned: { type: "integer" },
          heldAssigned: { type: "integer" },
          accounted: { type: "integer" },
        },
        required: ["unassigned", "heldAssigned", "accounted"],
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
            id: "assigned",
            label: "Assigned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "destroyed",
            label: "Destroyed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "dispensed",
            label: "Dispensed",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "unassigned",
            label: "Unassigned",
            valueType: { type: "integer" },
          },
          {
            id: "heldAssigned",
            label: "Held Assigned",
            valueType: { type: "integer" },
          },
          {
            id: "accounted",
            label: "Accounted",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gcpTrialMaterialReceiptReturnBalanceTool.execute;
export default gcpTrialMaterialReceiptReturnBalanceTool;
