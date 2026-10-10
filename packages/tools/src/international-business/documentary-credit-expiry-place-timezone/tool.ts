import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly creditId: string;
  readonly expiryLocalText: string;
  readonly expiryPlace: string;
  readonly timeZoneSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditId: { type: "string", maxLength: 8192, minLength: 1 },
    expiryLocalText: { type: "string", maxLength: 8192, minLength: 1 },
    expiryPlace: { type: "string", maxLength: 8192, minLength: 1 },
    timeZoneSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["creditId", "expiryLocalText", "expiryPlace", "timeZoneSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit documentary-credit expiry time, place and clock metadata without interpreting banking deadlines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { creditId, expiryLocalText, expiryPlace, timeZoneSource } = request;
  const compute = (): Output => {
    H.domain(creditId.length > 0, "creditId");
    H.domain(expiryLocalText.length > 0, "expiryLocalText");
    H.domain(expiryPlace.length > 0, "expiryPlace");
    H.domain(timeZoneSource.length > 0, "timeZoneSource");
    return {
      token: JSON.stringify([
        creditId,
        expiryLocalText,
        expiryPlace,
        timeZoneSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    creditId: "LC17",
    expiryLocalText: "2026-11-01 17:00",
    expiryPlace: "City A",
    timeZoneSource: "bank clock",
  },
  output: { token: '["LC17","2026-11-01 17:00","City A","bank clock"]' },
} satisfies ToolExample<Input, Output>;
export const documentaryCreditExpiryPlaceTimezoneTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/documentary-credit-expiry-place-timezone",
      title: "Documentary Credit Expiry Place Timezone Tool",
      description:
        "Preserve explicit documentary-credit expiry time, place and clock metadata without interpreting banking deadlines.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          creditId: { type: "string", maxLength: 8192, minLength: 1 },
          expiryLocalText: { type: "string", maxLength: 8192, minLength: 1 },
          expiryPlace: { type: "string", maxLength: 8192, minLength: 1 },
          timeZoneSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: [
          "creditId",
          "expiryLocalText",
          "expiryPlace",
          "timeZoneSource",
        ],
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
            id: "creditId",
            label: "Credit Id",
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
            id: "expiryPlace",
            label: "Expiry Place",
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
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = documentaryCreditExpiryPlaceTimezoneTool.execute;
export default documentaryCreditExpiryPlaceTimezoneTool;
