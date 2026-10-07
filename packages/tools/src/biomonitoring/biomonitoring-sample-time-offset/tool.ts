import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceHours: number;
  readonly sampleHours: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceHours: { type: "number" },
    sampleHours: { type: "number" },
  },
  required: ["referenceHours", "sampleHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit reference time from a biomonitoring sample time in hours. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceHours, sampleHours } = request;
  const compute = (): Output => {
    return { signedGap: sampleHours - referenceHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceHours: 12, sampleHours: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const biomonitoringSampleTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomonitoring", "biology"],
      keywords: ["biomonitoring", "biology"],
    },
    id: "biomonitoring/biomonitoring-sample-time-offset",
    title: "Biomonitoring Sample Time Offset",
    description:
      "Subtract an explicit reference time from a biomonitoring sample time in hours.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceHours: { type: "number" },
        sampleHours: { type: "number" },
      },
      required: ["referenceHours", "sampleHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceHours",
          label: "Reference Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleHours",
          label: "Sample Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biomonitoringSampleTimeOffsetTool.execute;
export default biomonitoringSampleTimeOffsetTool;
