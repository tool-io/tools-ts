import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly surveyed: boolean; readonly detected: boolean };
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { surveyed: { type: "boolean" }, detected: { type: "boolean" } },
  required: ["surveyed", "detected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Encode explicit survey and detection flags without treating nondetection as species absence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyed, detected } = request;
  const compute = (): Output => {
    H.domain(surveyed || !detected, "detected");
    return {
      code: !surveyed ? "not-surveyed" : detected ? "detected" : "not-detected",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surveyed: true, detected: false },
  output: { code: "not-detected" },
} satisfies ToolExample<Input, Output>;
export const occupancyDetectionNonDetectionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ecology", "biology"],
      keywords: ["ecology", "biology"],
    },
    id: "ecology/occupancy-detection-non-detection-code",
    title: "Occupancy Detection Non Detection Code",
    description:
      "Encode explicit survey and detection flags without treating nondetection as species absence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surveyed: { type: "boolean" },
        detected: { type: "boolean" },
      },
      required: ["surveyed", "detected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "string", maxLength: 8192 } },
      required: ["code"],
    },
    ports: {
      inputs: [
        {
          id: "surveyed",
          label: "Surveyed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "detected",
          label: "Detected",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = occupancyDetectionNonDetectionCodeTool.execute;
export default occupancyDetectionNonDetectionCodeTool;
