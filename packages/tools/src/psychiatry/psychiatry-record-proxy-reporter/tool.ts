import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly reporterId: string;
  readonly reporterRole: string;
};
export type Output = {
  readonly token: string;
  readonly sameIdentifier: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    reporterId: { type: "string", maxLength: 8192, minLength: 1 },
    reporterRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "reporterId", "reporterRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    sameIdentifier: { type: "boolean" },
  },
  required: ["token", "sameIdentifier"],
} as const;
/** Record explicit participant and reporter identifiers and role without assuming proxy and self reports are equivalent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, reporterId, reporterRole } = request;
  const compute = (): Output => {
    H.domain(
      participantId.length > 0 &&
        reporterId.length > 0 &&
        reporterRole.length > 0,
      "participantId",
    );
    return {
      token: JSON.stringify([participantId, reporterId, reporterRole]),
      sameIdentifier: participantId === reporterId,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { participantId: "P17", reporterId: "R2", reporterRole: "caregiver" },
  output: { token: '["P17","R2","caregiver"]', sameIdentifier: false },
} satisfies ToolExample<Input, Output>;
export const psychiatryRecordProxyReporterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["psychiatry", "health and medicine"],
      keywords: ["psychiatry", "health and medicine"],
    },
    id: "psychiatry/psychiatry-record-proxy-reporter",
    title: "Psychiatry Record Proxy Reporter",
    description:
      "Record explicit participant and reporter identifiers and role without assuming proxy and self reports are equivalent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        reporterId: { type: "string", maxLength: 8192, minLength: 1 },
        reporterRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "reporterId", "reporterRole"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        sameIdentifier: { type: "boolean" },
      },
      required: ["token", "sameIdentifier"],
    },
    ports: {
      inputs: [
        {
          id: "participantId",
          label: "Participant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reporterId",
          label: "Reporter Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reporterRole",
          label: "Reporter Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "token", label: "Token", valueType: { type: "string" } },
        {
          id: "sameIdentifier",
          label: "Same Identifier",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = psychiatryRecordProxyReporterTool.execute;
export default psychiatryRecordProxyReporterTool;
