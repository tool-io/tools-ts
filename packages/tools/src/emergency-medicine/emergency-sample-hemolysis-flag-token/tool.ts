import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["flagged", "not-flagged", "unknown", "not-assessed"],
    },
  },
  required: ["sampleId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve an explicitly reported emergency specimen hemolysis flag without interpreting analytes or specimen acceptability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(
      ["flagged", "not-flagged", "unknown", "not-assessed"].includes(
        recordedStatus,
      ),
      "recordedStatus",
    );
    return { label: sampleId + " [" + recordedStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", recordedStatus: "flagged" },
  output: { label: "S17 [flagged]" },
} satisfies ToolExample<Input, Output>;
export const emergencySampleHemolysisFlagTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/emergency-sample-hemolysis-flag-token",
    title: "Emergency Sample Hemolysis Flag Token Tool",
    description:
      "Preserve an explicitly reported emergency specimen hemolysis flag without interpreting analytes or specimen acceptability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["flagged", "not-flagged", "unknown", "not-assessed"],
        },
      },
      required: ["sampleId", "recordedStatus"],
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
          id: "sampleId",
          label: "Sample Id",
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
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = emergencySampleHemolysisFlagTokenTool.execute;
export default emergencySampleHemolysisFlagTokenTool;
