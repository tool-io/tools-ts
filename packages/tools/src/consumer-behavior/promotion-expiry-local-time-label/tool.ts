import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly promotionId: string;
  readonly expiryLocalText: string;
  readonly timeZoneSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    promotionId: { type: "string", maxLength: 8192, minLength: 1 },
    expiryLocalText: { type: "string", maxLength: 8192, minLength: 1 },
    timeZoneSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["promotionId", "expiryLocalText", "timeZoneSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit promotion expiry local-time transcription and time-zone source without resolving DST or expiry eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { promotionId, expiryLocalText, timeZoneSource } = request;
  const compute = (): Output => {
    H.domain(promotionId.length > 0, "promotionId");
    H.domain(expiryLocalText.length > 0, "expiryLocalText");
    H.domain(timeZoneSource.length > 0, "timeZoneSource");
    return {
      token: JSON.stringify([promotionId, expiryLocalText, timeZoneSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    promotionId: "P17",
    expiryLocalText: "2026-11-01 18:00",
    timeZoneSource: "Europe/Berlin",
  },
  output: { token: '["P17","2026-11-01 18:00","Europe/Berlin"]' },
} satisfies ToolExample<Input, Output>;
export const promotionExpiryLocalTimeLabelTool = H.defineSchemaCalculation<
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
    id: "consumer-behavior/promotion-expiry-local-time-label",
    title: "Promotion Expiry Local Time Label",
    description:
      "Preserve an explicit promotion expiry local-time transcription and time-zone source without resolving DST or expiry eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        promotionId: { type: "string", maxLength: 8192, minLength: 1 },
        expiryLocalText: { type: "string", maxLength: 8192, minLength: 1 },
        timeZoneSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["promotionId", "expiryLocalText", "timeZoneSource"],
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
          id: "promotionId",
          label: "Promotion Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expiryLocalText",
          label: "Expiry Local Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timeZoneSource",
          label: "Time Zone Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = promotionExpiryLocalTimeLabelTool.execute;
export default promotionExpiryLocalTimeLabelTool;
