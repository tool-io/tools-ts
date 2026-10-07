import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly eventCode: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    eventCode: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "eventCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly reported event code by source without classifying causality or severity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, eventCode, source } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(eventCode.length > 0, "eventCode");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([recordId, eventCode, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "AE17", eventCode: "E2", source: "Study codebook" },
  output: { token: '["AE17","E2","Study codebook"]' },
} satisfies ToolExample<Input, Output>;
export const chiropracticAdverseEventCodeSourceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["chiropractic", "health and medicine"],
      keywords: ["chiropractic", "health and medicine"],
    },
    id: "chiropractic/chiropractic-adverse-event-code-source",
    title: "Chiropractic Adverse Event Code Source",
    description:
      "Qualify an explicitly reported event code by source without classifying causality or severity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        eventCode: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "eventCode", "source"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eventCode",
          label: "Event Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = chiropracticAdverseEventCodeSourceTool.execute;
export default chiropracticAdverseEventCodeSourceTool;
