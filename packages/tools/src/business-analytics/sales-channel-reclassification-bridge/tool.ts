import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingChannelValue: number;
  readonly transferredIn: number;
  readonly transferredOut: number;
};
export type Output = { readonly closingChannelValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingChannelValue: { type: "number" },
    transferredIn: { type: "number", minimum: 0 },
    transferredOut: { type: "number", minimum: 0 },
  },
  required: ["openingChannelValue", "transferredIn", "transferredOut"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingChannelValue: { type: "number" } },
  required: ["closingChannelValue"],
} as const;
/** Bridge supplied channel value using explicit reclassifications in and out without treating transfers as new sales. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingChannelValue, transferredIn, transferredOut } = request;
  const compute = (): Output => {
    H.domain(transferredIn >= 0, "transferredIn");
    H.domain(transferredOut >= 0, "transferredOut");
    return {
      closingChannelValue: openingChannelValue + transferredIn - transferredOut,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingChannelValue: 100, transferredIn: 20, transferredOut: 5 },
  output: { closingChannelValue: 115 },
} satisfies ToolExample<Input, Output>;
export const salesChannelReclassificationBridgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/sales-channel-reclassification-bridge",
    title: "Sales Channel Reclassification Bridge",
    description:
      "Bridge supplied channel value using explicit reclassifications in and out without treating transfers as new sales.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingChannelValue: { type: "number" },
        transferredIn: { type: "number", minimum: 0 },
        transferredOut: { type: "number", minimum: 0 },
      },
      required: ["openingChannelValue", "transferredIn", "transferredOut"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingChannelValue: { type: "number" } },
      required: ["closingChannelValue"],
    },
    ports: {
      inputs: [
        {
          id: "openingChannelValue",
          label: "Opening Channel Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferredIn",
          label: "Transferred In",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferredOut",
          label: "Transferred Out",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingChannelValue",
          label: "Closing Channel Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = salesChannelReclassificationBridgeTool.execute;
export default salesChannelReclassificationBridgeTool;
