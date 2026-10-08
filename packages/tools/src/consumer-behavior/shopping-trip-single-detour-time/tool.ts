import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly directTripMinutes: number;
  readonly detourTripMinutes: number;
};
export type Output = { readonly extraMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    directTripMinutes: { type: "number", minimum: 0 },
    detourTripMinutes: { type: "number", minimum: 0 },
  },
  required: ["directTripMinutes", "detourTripMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { extraMinutes: { type: "number" } },
  required: ["extraMinutes"],
} as const;
/** Subtract supplied direct-trip time from alternative shopping-trip time without route or traffic lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { directTripMinutes, detourTripMinutes } = request;
  const compute = (): Output => {
    H.domain(directTripMinutes >= 0, "directTripMinutes");
    H.domain(detourTripMinutes >= 0, "detourTripMinutes");
    return { extraMinutes: detourTripMinutes - directTripMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { directTripMinutes: 20, detourTripMinutes: 28 },
  output: { extraMinutes: 8 },
} satisfies ToolExample<Input, Output>;
export const shoppingTripSingleDetourTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/shopping-trip-single-detour-time",
    title: "Shopping Trip Single Detour Time",
    description:
      "Subtract supplied direct-trip time from alternative shopping-trip time without route or traffic lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        directTripMinutes: { type: "number", minimum: 0 },
        detourTripMinutes: { type: "number", minimum: 0 },
      },
      required: ["directTripMinutes", "detourTripMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { extraMinutes: { type: "number" } },
      required: ["extraMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "directTripMinutes",
          label: "Direct Trip Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "detourTripMinutes",
          label: "Detour Trip Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "extraMinutes",
          label: "Extra Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shoppingTripSingleDetourTimeTool.execute;
export default shoppingTripSingleDetourTimeTool;
