import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseText: string;
  readonly redact: boolean;
  readonly replacement: string;
};
export type Output = { readonly displayText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseText: { type: "string", maxLength: 8192 },
    redact: { type: "boolean" },
    replacement: { type: "string", maxLength: 8192 },
  },
  required: ["caseText", "redact", "replacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayText: { type: "string", maxLength: 8192 } },
  required: ["displayText"],
} as const;
/** Apply an explicit whole-field case-reference redaction switch without inspecting sensitive content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseText, redact, replacement } = request;
  const compute = (): Output => {
    H.domain(!redact || replacement.length > 0, "redact");
    return { displayText: redact ? replacement : caseText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caseText: "CASE-123", redact: true, replacement: "[redacted]" },
  output: { displayText: "[redacted]" },
} satisfies ToolExample<Input, Output>;
export const forensicCaseRedactionMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "forensic-science",
        "forensic science",
        "research and quality management",
      ],
      keywords: ["forensic science", "research and quality management"],
    },
    id: "forensic-science/forensic-case-redaction-marker",
    title: "Forensic Case Redaction Marker",
    description:
      "Apply an explicit whole-field case-reference redaction switch without inspecting sensitive content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseText: { type: "string", maxLength: 8192 },
        redact: { type: "boolean" },
        replacement: { type: "string", maxLength: 8192 },
      },
      required: ["caseText", "redact", "replacement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayText: { type: "string", maxLength: 8192 } },
      required: ["displayText"],
    },
    ports: {
      inputs: [
        {
          id: "caseText",
          label: "Case Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "redact",
          label: "Redact",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "replacement",
          label: "Replacement",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "displayText",
          label: "Display Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = forensicCaseRedactionMarkerTool.execute;
export default forensicCaseRedactionMarkerTool;
