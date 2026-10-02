import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly barIndex: number;
  readonly pickupBars: number;
  readonly includePickup: boolean;
};
export type Output = { readonly displayIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    barIndex: { type: "integer", minimum: 0 },
    pickupBars: { type: "integer", minimum: 0 },
    includePickup: { type: "boolean" },
  },
  required: ["barIndex", "pickupBars", "includePickup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayIndex: { type: "integer" } },
  required: ["displayIndex"],
} as const;
/** Shift a supplied zero-based bar index under an explicit pickup-bar numbering convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { barIndex, pickupBars, includePickup } = request;
  const compute = (): Output => {
    H.integer(barIndex, 0);
    H.integer(pickupBars, 0);
    return { displayIndex: barIndex - (includePickup ? pickupBars : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { barIndex: 1, pickupBars: 1, includePickup: true },
  output: { displayIndex: 0 },
} satisfies ToolExample<Input, Output>;
export const orchestraPickupBarIndexShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/orchestra-pickup-bar-index-shift",
    title: "Orchestra Pickup Bar Index Shift Tool",
    description:
      "Shift a supplied zero-based bar index under an explicit pickup-bar numbering convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        barIndex: { type: "integer", minimum: 0 },
        pickupBars: { type: "integer", minimum: 0 },
        includePickup: { type: "boolean" },
      },
      required: ["barIndex", "pickupBars", "includePickup"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayIndex: { type: "integer" } },
      required: ["displayIndex"],
    },
    ports: {
      inputs: [
        {
          id: "barIndex",
          label: "Bar Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pickupBars",
          label: "Pickup Bars",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includePickup",
          label: "Include Pickup",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "displayIndex",
          label: "Display Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = orchestraPickupBarIndexShiftTool.execute;
export default orchestraPickupBarIndexShiftTool;
