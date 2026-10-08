import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reservedSlotMinutes: number;
  readonly actualUnloadingMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reservedSlotMinutes: { type: "number" },
    actualUnloadingMinutes: { type: "number" },
  },
  required: ["reservedSlotMinutes", "actualUnloadingMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied actual unloading minus reserved slot duration, retaining unused time as a negative overrun. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reservedSlotMinutes, actualUnloadingMinutes } = request;
  const compute = (): Output => {
    return { signedGap: actualUnloadingMinutes - reservedSlotMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reservedSlotMinutes: 12, actualUnloadingMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const siteDeliveryUnloadingSlotOverrunTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/site-delivery-unloading-slot-overrun",
    title: "Site Delivery Unloading Slot Overrun",
    description:
      "Calculate supplied actual unloading minus reserved slot duration, retaining unused time as a negative overrun.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reservedSlotMinutes: { type: "number" },
        actualUnloadingMinutes: { type: "number" },
      },
      required: ["reservedSlotMinutes", "actualUnloadingMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "reservedSlotMinutes",
          label: "Reserved Slot Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualUnloadingMinutes",
          label: "Actual Unloading Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = siteDeliveryUnloadingSlotOverrunTool.execute;
export default siteDeliveryUnloadingSlotOverrunTool;
