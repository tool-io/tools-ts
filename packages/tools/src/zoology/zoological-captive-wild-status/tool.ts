import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly recordedStatus: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["captive", "wild", "unknown", "other"],
    },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "recordedStatus", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record an explicitly assigned captive/wild status without inferring animal provenance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, recordedStatus, source } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0 && source.length > 0, "specimenId");
    H.domain(
      ["captive", "wild", "unknown", "other"].includes(recordedStatus),
      "recordedStatus",
    );
    return { label: specimenId + "; " + recordedStatus + " [" + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "Z17", recordedStatus: "captive", source: "Keeper log" },
  output: { label: "Z17; captive [Keeper log]" },
} satisfies ToolExample<Input, Output>;
export const zoologicalCaptiveWildStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["zoology", "biology"],
      keywords: ["zoology", "biology"],
    },
    id: "zoology/zoological-captive-wild-status",
    title: "Zoological Captive Wild Status",
    description:
      "Record an explicitly assigned captive/wild status without inferring animal provenance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["captive", "wild", "unknown", "other"],
        },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "recordedStatus", "source"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedStatus",
          label: "Recorded Status",
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
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = zoologicalCaptiveWildStatusTool.execute;
export default zoologicalCaptiveWildStatusTool;
