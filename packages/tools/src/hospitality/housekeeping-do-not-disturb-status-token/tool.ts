import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roomRecordId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roomRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["do-not-disturb", "service-requested", "no-indication", "unknown"],
    },
  },
  required: ["roomRecordId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded housekeeping service preference without overriding guest instructions or granting room access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roomRecordId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(roomRecordId.length > 0, "roomRecordId");
    H.domain(
      [
        "do-not-disturb",
        "service-requested",
        "no-indication",
        "unknown",
      ].includes(recordedStatus),
      "recordedStatus",
    );
    return { label: roomRecordId + " [" + recordedStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roomRecordId: "R17", recordedStatus: "do-not-disturb" },
  output: { label: "R17 [do-not-disturb]" },
} satisfies ToolExample<Input, Output>;
export const housekeepingDoNotDisturbStatusTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["hospitality", "business and finance"],
        keywords: ["hospitality", "business and finance"],
      },
      id: "hospitality/housekeeping-do-not-disturb-status-token",
      title: "Housekeeping Do Not Disturb Status Token",
      description:
        "Label an explicitly recorded housekeeping service preference without overriding guest instructions or granting room access.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          roomRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedStatus: {
            type: "string",
            maxLength: 8192,
            enum: [
              "do-not-disturb",
              "service-requested",
              "no-indication",
              "unknown",
            ],
          },
        },
        required: ["roomRecordId", "recordedStatus"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "roomRecordId",
            label: "Room Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "recordedStatus",
            label: "Recorded Status",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = housekeepingDoNotDisturbStatusTokenTool.execute;
export default housekeepingDoNotDisturbStatusTokenTool;
