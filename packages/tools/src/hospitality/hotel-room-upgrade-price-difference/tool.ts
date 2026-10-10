import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalRate: number;
  readonly upgradedRate: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalRate: { type: "number" },
    upgradedRate: { type: "number" },
  },
  required: ["originalRate", "upgradedRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit original room rate from a supplied upgrade rate on the same currency and stay basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalRate, upgradedRate } = request;
  const compute = (): Output => {
    return { signedGap: upgradedRate - originalRate };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalRate: 12, upgradedRate: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const hotelRoomUpgradePriceDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["hospitality", "business and finance"],
      keywords: ["hospitality", "business and finance"],
    },
    id: "hospitality/hotel-room-upgrade-price-difference",
    title: "Hotel Room Upgrade Price Difference",
    description:
      "Subtract an explicit original room rate from a supplied upgrade rate on the same currency and stay basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalRate: { type: "number" },
        upgradedRate: { type: "number" },
      },
      required: ["originalRate", "upgradedRate"],
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
          id: "originalRate",
          label: "Original Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upgradedRate",
          label: "Upgraded Rate",
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
export const run = hotelRoomUpgradePriceDifferenceTool.execute;
export default hotelRoomUpgradePriceDifferenceTool;
