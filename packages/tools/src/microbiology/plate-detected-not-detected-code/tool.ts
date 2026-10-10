import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plateId: string;
  readonly readComplete: boolean;
  readonly detected: boolean;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plateId: { type: "string", maxLength: 8192, minLength: 1 },
    readComplete: { type: "boolean" },
    detected: { type: "boolean" },
  },
  required: ["plateId", "readComplete", "detected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Encode explicit plate-read and detection flags without treating nondetection as sterility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plateId, readComplete, detected } = request;
  const compute = (): Output => {
    H.domain(plateId.length > 0, "plateId");
    H.domain(readComplete || !detected, "detected");
    return {
      status: !readComplete
        ? "not-read"
        : detected
          ? "detected"
          : "not-detected",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plateId: "PL17", readComplete: true, detected: false },
  output: { status: "not-detected" },
} satisfies ToolExample<Input, Output>;
export const plateDetectednotdetectedCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["microbiology", "biology"],
      keywords: ["microbiology", "biology"],
    },
    id: "microbiology/plate-detected-not-detected-code",
    title: "Plate Detected Not Detected Code",
    description:
      "Encode explicit plate-read and detection flags without treating nondetection as sterility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plateId: { type: "string", maxLength: 8192, minLength: 1 },
        readComplete: { type: "boolean" },
        detected: { type: "boolean" },
      },
      required: ["plateId", "readComplete", "detected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "plateId",
          label: "Plate Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "readComplete",
          label: "Read Complete",
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
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = plateDetectednotdetectedCodeTool.execute;
export default plateDetectednotdetectedCodeTool;
