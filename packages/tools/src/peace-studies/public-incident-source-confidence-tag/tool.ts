import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly incidentId: string;
  readonly confidenceLabel: string;
  readonly sourceId: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incidentId: { type: "string", maxLength: 8192 },
    confidenceLabel: { type: "string", maxLength: 8192 },
    sourceId: { type: "string", maxLength: 8192 },
  },
  required: ["incidentId", "confidenceLabel", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach an explicitly supplied source confidence label without rating source reliability or establishing incident facts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incidentId, confidenceLabel, sourceId } = request;
  const compute = (): Output => {
    H.domain(
      incidentId.length > 0 &&
        confidenceLabel.length > 0 &&
        sourceId.length > 0,
      "incidentId",
    );
    return { tag: incidentId + " [" + confidenceLabel + "; " + sourceId + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    incidentId: "E17",
    confidenceLabel: "source-rated medium",
    sourceId: "S3",
  },
  output: { tag: "E17 [source-rated medium; S3]" },
} satisfies ToolExample<Input, Output>;
export const publicIncidentSourceConfidenceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/public-incident-source-confidence-tag",
    title: "Public Incident Source Confidence Tag Tool",
    description:
      "Attach an explicitly supplied source confidence label without rating source reliability or establishing incident facts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incidentId: { type: "string", maxLength: 8192 },
        confidenceLabel: { type: "string", maxLength: 8192 },
        sourceId: { type: "string", maxLength: 8192 },
      },
      required: ["incidentId", "confidenceLabel", "sourceId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "incidentId",
          label: "Incident Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "confidenceLabel",
          label: "Confidence Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicIncidentSourceConfidenceTagTool.execute;
export default publicIncidentSourceConfidenceTagTool;
