import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reporterCaseId: string;
  readonly eventRecordId: string;
  readonly sourceSystem: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reporterCaseId: { type: "string", maxLength: 8192, minLength: 1 },
    eventRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceSystem: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reporterCaseId", "eventRecordId", "sourceSystem"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous key from explicit adverse-event identifiers without probabilistic duplicate detection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reporterCaseId, eventRecordId, sourceSystem } = request;
  const compute = (): Output => {
    H.domain(reporterCaseId.length > 0, "reporterCaseId");
    H.domain(eventRecordId.length > 0, "eventRecordId");
    H.domain(sourceSystem.length > 0, "sourceSystem");
    return {
      token: JSON.stringify([reporterCaseId, eventRecordId, sourceSystem]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reporterCaseId: "CASE17",
    eventRecordId: "EV2",
    sourceSystem: "Registry A",
  },
  output: { token: '["CASE17","EV2","Registry A"]' },
} satisfies ToolExample<Input, Output>;
export const adverseEventReportDuplicateKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacoepidemiology", "pharmacy"],
      keywords: ["pharmacoepidemiology", "pharmacy"],
    },
    id: "pharmacoepidemiology/adverse-event-report-duplicate-key",
    title: "Adverse Event Report Duplicate Key",
    description:
      "Build an unambiguous key from explicit adverse-event identifiers without probabilistic duplicate detection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reporterCaseId: { type: "string", maxLength: 8192, minLength: 1 },
        eventRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceSystem: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["reporterCaseId", "eventRecordId", "sourceSystem"],
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
          id: "reporterCaseId",
          label: "Reporter Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eventRecordId",
          label: "Event Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceSystem",
          label: "Source System",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = adverseEventReportDuplicateKeyTool.execute;
export default adverseEventReportDuplicateKeyTool;
