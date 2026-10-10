import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shipmentId: string;
  readonly recordedOriginStatus: string;
  readonly sourceRule: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shipmentId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedOriginStatus: { type: "string", maxLength: 8192, minLength: 1 },
    sourceRule: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["shipmentId", "recordedOriginStatus", "sourceRule"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit trade-origin status wording and its source without determining preferential eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shipmentId, recordedOriginStatus, sourceRule } = request;
  const compute = (): Output => {
    H.domain(shipmentId.length > 0, "shipmentId");
    H.domain(recordedOriginStatus.length > 0, "recordedOriginStatus");
    H.domain(sourceRule.length > 0, "sourceRule");
    return {
      token: JSON.stringify([shipmentId, recordedOriginStatus, sourceRule]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shipmentId: "S17",
    recordedOriginStatus: "declared eligible",
    sourceRule: "Rule A",
  },
  output: { token: '["S17","declared eligible","Rule A"]' },
} satisfies ToolExample<Input, Output>;
export const tradePreferenceOriginStatusTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-economics",
        "international economics",
        "economics",
      ],
      keywords: ["international economics", "economics"],
    },
    id: "international-economics/trade-preference-origin-status-tag",
    title: "Trade Preference Origin Status Tag",
    description:
      "Record explicit trade-origin status wording and its source without determining preferential eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shipmentId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedOriginStatus: { type: "string", maxLength: 8192, minLength: 1 },
        sourceRule: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["shipmentId", "recordedOriginStatus", "sourceRule"],
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
          id: "shipmentId",
          label: "Shipment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedOriginStatus",
          label: "Recorded Origin Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceRule",
          label: "Source Rule",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tradePreferenceOriginStatusTagTool.execute;
export default tradePreferenceOriginStatusTagTool;
