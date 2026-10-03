import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispatched: number;
  readonly received: number;
  readonly confirmedLost: number;
};
export type Output = {
  readonly inTransit: number;
  readonly unresolved: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispatched: { type: "integer", minimum: 0 },
    received: { type: "integer", minimum: 0 },
    confirmedLost: { type: "integer", minimum: 0 },
  },
  required: ["dispatched", "received", "confirmedLost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inTransit: { type: "integer" },
    unresolved: { type: "integer" },
  },
  required: ["inTransit", "unresolved"],
} as const;
/** Calculate stock transfer in transit balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispatched, received, confirmedLost } = request;
  const compute = (): Output => {
    H.integer(dispatched, 0);
    H.integer(received, 0, dispatched);
    H.integer(confirmedLost, 0, dispatched - received);
    return {
      inTransit: dispatched - received,
      unresolved: dispatched - received - confirmedLost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dispatched: 100, received: 70, confirmedLost: 5 },
  output: { inTransit: 30, unresolved: 25 },
} satisfies ToolExample<Input, Output>;
export const stockTransferInTransitBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/stock-transfer-in-transit-balance",
    title: "Stock Transfer In Transit Balance Tool",
    description:
      "Calculate stock transfer in transit balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dispatched: { type: "integer", minimum: 0 },
        received: { type: "integer", minimum: 0 },
        confirmedLost: { type: "integer", minimum: 0 },
      },
      required: ["dispatched", "received", "confirmedLost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inTransit: { type: "integer" },
        unresolved: { type: "integer" },
      },
      required: ["inTransit", "unresolved"],
    },
    ports: {
      inputs: [
        {
          id: "dispatched",
          label: "Dispatched",
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
          id: "confirmedLost",
          label: "Confirmed Lost",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "inTransit",
          label: "In Transit",
          valueType: { type: "integer" },
        },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = stockTransferInTransitBalanceTool.execute;
export default stockTransferInTransitBalanceTool;
