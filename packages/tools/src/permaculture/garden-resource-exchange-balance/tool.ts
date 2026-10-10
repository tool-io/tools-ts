import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingResource: number;
  readonly receivedResource: number;
  readonly sentResource: number;
};
export type Output = { readonly closingResource: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingResource: { type: "number", minimum: 0 },
    receivedResource: { type: "number", minimum: 0 },
    sentResource: { type: "number", minimum: 0 },
  },
  required: ["openingResource", "receivedResource", "sentResource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingResource: { type: "number" } },
  required: ["closingResource"],
} as const;
/** Reconcile explicit compatible resource quantities and preserve a signed shortfall without assigning exchange values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingResource, receivedResource, sentResource } = request;
  const compute = (): Output => {
    H.domain(
      openingResource >= 0 && receivedResource >= 0 && sentResource >= 0,
      "openingResource",
    );
    return {
      closingResource: openingResource + receivedResource - sentResource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingResource: 20, receivedResource: 8, sentResource: 5 },
  output: { closingResource: 23 },
} satisfies ToolExample<Input, Output>;
export const gardenResourceExchangeBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["permaculture", "agriculture"],
      keywords: ["permaculture", "agriculture"],
    },
    id: "permaculture/garden-resource-exchange-balance",
    title: "Garden Resource Exchange Balance",
    description:
      "Reconcile explicit compatible resource quantities and preserve a signed shortfall without assigning exchange values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingResource: { type: "number", minimum: 0 },
        receivedResource: { type: "number", minimum: 0 },
        sentResource: { type: "number", minimum: 0 },
      },
      required: ["openingResource", "receivedResource", "sentResource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingResource: { type: "number" } },
      required: ["closingResource"],
    },
    ports: {
      inputs: [
        {
          id: "openingResource",
          label: "Opening Resource",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedResource",
          label: "Received Resource",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sentResource",
          label: "Sent Resource",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingResource",
          label: "Closing Resource",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gardenResourceExchangeBalanceTool.execute;
export default gardenResourceExchangeBalanceTool;
