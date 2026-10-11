import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispatchedUnits: number;
  readonly receivedUnits: number;
  readonly declaredInTransitUnits: number;
};
export type Output = { readonly unexplainedShortfall: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispatchedUnits: { type: "integer", minimum: 0 },
    receivedUnits: { type: "integer", minimum: 0 },
    declaredInTransitUnits: { type: "integer", minimum: 0 },
  },
  required: ["dispatchedUnits", "receivedUnits", "declaredInTransitUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unexplainedShortfall: { type: "integer" } },
  required: ["unexplainedShortfall"],
} as const;
/** Reconcile explicit transfer dispatch, receipt, and separately recorded in-transit counts without inferring losses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispatchedUnits, receivedUnits, declaredInTransitUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(dispatchedUnits) &&
        dispatchedUnits >= 0 &&
        dispatchedUnits <= Number.MAX_SAFE_INTEGER,
      "dispatchedUnits",
    ),
      dispatchedUnits);
    (H.domain(
      Number.isSafeInteger(receivedUnits) &&
        receivedUnits >= 0 &&
        receivedUnits <= Number.MAX_SAFE_INTEGER,
      "receivedUnits",
    ),
      receivedUnits);
    (H.domain(
      Number.isSafeInteger(declaredInTransitUnits) &&
        declaredInTransitUnits >= 0 &&
        declaredInTransitUnits <= Number.MAX_SAFE_INTEGER,
      "declaredInTransitUnits",
    ),
      declaredInTransitUnits);
    return {
      unexplainedShortfall: Number(
        BigInt(dispatchedUnits) -
          BigInt(receivedUnits) -
          BigInt(declaredInTransitUnits),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dispatchedUnits: 100,
    receivedUnits: 80,
    declaredInTransitUnits: 15,
  },
  output: { unexplainedShortfall: 5 },
} satisfies ToolExample<Input, Output>;
export const transferOrderReceivedShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["supply-chain", "supply chain", "business and finance"],
      keywords: ["supply chain", "business and finance"],
    },
    id: "supply-chain/transfer-order-received-shortfall",
    title: "Transfer Order Received Shortfall",
    description:
      "Reconcile explicit transfer dispatch, receipt, and separately recorded in-transit counts without inferring losses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dispatchedUnits: { type: "integer", minimum: 0 },
        receivedUnits: { type: "integer", minimum: 0 },
        declaredInTransitUnits: { type: "integer", minimum: 0 },
      },
      required: ["dispatchedUnits", "receivedUnits", "declaredInTransitUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unexplainedShortfall: { type: "integer" } },
      required: ["unexplainedShortfall"],
    },
    ports: {
      inputs: [
        {
          id: "dispatchedUnits",
          label: "Dispatched Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "receivedUnits",
          label: "Received Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "declaredInTransitUnits",
          label: "Declared In Transit Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unexplainedShortfall",
          label: "Unexplained Shortfall",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = transferOrderReceivedShortfallTool.execute;
export default transferOrderReceivedShortfallTool;
