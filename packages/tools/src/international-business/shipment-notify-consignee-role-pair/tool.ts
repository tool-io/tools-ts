import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shipmentId: string;
  readonly notifyPartyId: string;
  readonly consigneeId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shipmentId: { type: "string", maxLength: 8192, minLength: 1 },
    notifyPartyId: { type: "string", maxLength: 8192, minLength: 1 },
    consigneeId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["shipmentId", "notifyPartyId", "consigneeId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicitly supplied shipment notify-party and consignee roles as distinct ordered fields without identity inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shipmentId, notifyPartyId, consigneeId } = request;
  const compute = (): Output => {
    H.domain(shipmentId.length > 0, "shipmentId");
    H.domain(notifyPartyId.length > 0, "notifyPartyId");
    H.domain(consigneeId.length > 0, "consigneeId");
    return { token: JSON.stringify([shipmentId, notifyPartyId, consigneeId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shipmentId: "S17", notifyPartyId: "N4", consigneeId: "C2" },
  output: { token: '["S17","N4","C2"]' },
} satisfies ToolExample<Input, Output>;
export const shipmentNotifyConsigneeRolePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/shipment-notify-consignee-role-pair",
    title: "Shipment Notify Consignee Role Pair Tool",
    description:
      "Record explicitly supplied shipment notify-party and consignee roles as distinct ordered fields without identity inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shipmentId: { type: "string", maxLength: 8192, minLength: 1 },
        notifyPartyId: { type: "string", maxLength: 8192, minLength: 1 },
        consigneeId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["shipmentId", "notifyPartyId", "consigneeId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "shipmentId",
          label: "Shipment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "notifyPartyId",
          label: "Notify Party Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "consigneeId",
          label: "Consignee Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = shipmentNotifyConsigneeRolePairTool.execute;
export default shipmentNotifyConsigneeRolePairTool;
