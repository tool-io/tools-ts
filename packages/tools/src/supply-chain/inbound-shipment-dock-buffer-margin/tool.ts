import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalMinutes: number;
  readonly dockAvailableUntilMinutes: number;
  readonly suppliedHandlingMinutes: number;
};
export type Output = {
  readonly availableMinutes: number;
  readonly handlingMarginMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalMinutes: { type: "number" },
    dockAvailableUntilMinutes: { type: "number" },
    suppliedHandlingMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "arrivalMinutes",
    "dockAvailableUntilMinutes",
    "suppliedHandlingMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "number" },
    handlingMarginMinutes: { type: "number" },
  },
  required: ["availableMinutes", "handlingMarginMinutes"],
} as const;
/** Compare explicit dock availability after arrival with a supplied handling duration without scheduling a shipment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalMinutes, dockAvailableUntilMinutes, suppliedHandlingMinutes } =
    request;
  const compute = (): Output => {
    H.domain(suppliedHandlingMinutes >= 0, "suppliedHandlingMinutes");
    return {
      availableMinutes: dockAvailableUntilMinutes - arrivalMinutes,
      handlingMarginMinutes:
        dockAvailableUntilMinutes - arrivalMinutes - suppliedHandlingMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    arrivalMinutes: 100,
    dockAvailableUntilMinutes: 160,
    suppliedHandlingMinutes: 45,
  },
  output: { availableMinutes: 60, handlingMarginMinutes: 15 },
} satisfies ToolExample<Input, Output>;
export const inboundShipmentDockBufferMarginTool = H.defineSchemaCalculation<
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
    id: "supply-chain/inbound-shipment-dock-buffer-margin",
    title: "Inbound Shipment Dock Buffer Margin",
    description:
      "Compare explicit dock availability after arrival with a supplied handling duration without scheduling a shipment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalMinutes: { type: "number" },
        dockAvailableUntilMinutes: { type: "number" },
        suppliedHandlingMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "arrivalMinutes",
        "dockAvailableUntilMinutes",
        "suppliedHandlingMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "number" },
        handlingMarginMinutes: { type: "number" },
      },
      required: ["availableMinutes", "handlingMarginMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalMinutes",
          label: "Arrival Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dockAvailableUntilMinutes",
          label: "Dock Available Until Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHandlingMinutes",
          label: "Supplied Handling Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableMinutes",
          label: "Available Minutes",
          valueType: { type: "number" },
        },
        {
          id: "handlingMarginMinutes",
          label: "Handling Margin Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inboundShipmentDockBufferMarginTool.execute;
export default inboundShipmentDockBufferMarginTool;
