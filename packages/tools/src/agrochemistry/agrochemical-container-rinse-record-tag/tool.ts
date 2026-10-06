import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerId: string;
  readonly rinseRecordId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerId: { type: "string", maxLength: 8192, minLength: 1 },
    rinseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["containerId", "rinseRecordId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit container rinse-record metadata without specifying rinsing or disposal procedures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerId, rinseRecordId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(containerId.length > 0, "containerId");
    H.domain(rinseRecordId.length > 0, "rinseRecordId");
    H.domain(recordedStatus.length > 0, "recordedStatus");
    return {
      token: JSON.stringify([containerId, rinseRecordId, recordedStatus]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    containerId: "CONT17",
    rinseRecordId: "R2",
    recordedStatus: "recorded",
  },
  output: { token: '["CONT17","R2","recorded"]' },
} satisfies ToolExample<Input, Output>;
export const agrochemicalContainerRinseRecordTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["agrochemistry", "agriculture"],
        keywords: ["agrochemistry", "agriculture"],
      },
      id: "agrochemistry/agrochemical-container-rinse-record-tag",
      title: "Agrochemical Container Rinse Record Tag",
      description:
        "Preserve explicit container rinse-record metadata without specifying rinsing or disposal procedures.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          containerId: { type: "string", maxLength: 8192, minLength: 1 },
          rinseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedStatus: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["containerId", "rinseRecordId", "recordedStatus"],
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
            id: "containerId",
            label: "Container Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "rinseRecordId",
            label: "Rinse Record Id",
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
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = agrochemicalContainerRinseRecordTagTool.execute;
export default agrochemicalContainerRinseRecordTagTool;
