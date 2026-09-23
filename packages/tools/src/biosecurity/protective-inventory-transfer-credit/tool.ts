import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly starting: number;
  readonly sent: number;
  readonly received: number;
  readonly duplicatedReceipt: number;
};
export type Output = { readonly ending: number; readonly netTransfer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    starting: { type: "integer", minimum: 0 },
    sent: { type: "integer", minimum: 0 },
    received: { type: "integer", minimum: 0 },
    duplicatedReceipt: { type: "integer", minimum: 0 },
  },
  required: ["starting", "sent", "received", "duplicatedReceipt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ending: { type: "integer" }, netTransfer: { type: "integer" } },
  required: ["ending", "netTransfer"],
} as const;
/** Reconcile generic protective inventory transfers with supplied duplicate-receipt counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { starting, sent, received, duplicatedReceipt } = request;
  const compute = (): Output => {
    H.integer(starting, 0);
    H.integer(sent, 0, starting);
    H.integer(received, 0);
    H.integer(duplicatedReceipt, 0, received);
    return {
      ending: Number(
        BigInt(starting) -
          BigInt(sent) +
          BigInt(received) -
          BigInt(duplicatedReceipt),
      ),
      netTransfer: received - duplicatedReceipt - sent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { starting: 100, sent: 20, received: 30, duplicatedReceipt: 5 },
  output: { ending: 105, netTransfer: 5 },
} satisfies ToolExample<Input, Output>;
export const protectiveInventoryTransferCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/protective-inventory-transfer-credit",
    title: "Protective Inventory Transfer Credit Tool",
    description:
      "Reconcile generic protective inventory transfers with supplied duplicate-receipt counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        starting: { type: "integer", minimum: 0 },
        sent: { type: "integer", minimum: 0 },
        received: { type: "integer", minimum: 0 },
        duplicatedReceipt: { type: "integer", minimum: 0 },
      },
      required: ["starting", "sent", "received", "duplicatedReceipt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ending: { type: "integer" },
        netTransfer: { type: "integer" },
      },
      required: ["ending", "netTransfer"],
    },
    ports: {
      inputs: [
        {
          id: "starting",
          label: "Starting",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sent",
          label: "Sent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "duplicatedReceipt",
          label: "Duplicated Receipt",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ending", label: "Ending", valueType: { type: "integer" } },
        {
          id: "netTransfer",
          label: "Net Transfer",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveInventoryTransferCreditTool.execute;
export default protectiveInventoryTransferCreditTool;
