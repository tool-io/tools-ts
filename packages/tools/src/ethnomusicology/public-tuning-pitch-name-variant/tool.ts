import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingId: string;
  readonly suppliedPitchName: string;
  readonly namingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPitchName: { type: "string", maxLength: 8192, minLength: 1 },
    namingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordingId", "suppliedPitchName", "namingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit public tuning pitch-name variant and source without equating tuning systems or deriving frequency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingId, suppliedPitchName, namingSource } = request;
  const compute = (): Output => {
    H.domain(recordingId.length > 0, "recordingId");
    H.domain(suppliedPitchName.length > 0, "suppliedPitchName");
    H.domain(namingSource.length > 0, "namingSource");
    return {
      token: JSON.stringify([recordingId, suppliedPitchName, namingSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordingId: "R17",
    suppliedPitchName: "Sa",
    namingSource: "source S4",
  },
  output: { token: '["R17","Sa","source S4"]' },
} satisfies ToolExample<Input, Output>;
export const publicTuningPitchNameVariantTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/public-tuning-pitch-name-variant",
    title: "Public Tuning Pitch Name Variant Tool",
    description:
      "Preserve an explicit public tuning pitch-name variant and source without equating tuning systems or deriving frequency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordingId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPitchName: { type: "string", maxLength: 8192, minLength: 1 },
        namingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordingId", "suppliedPitchName", "namingSource"],
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
          id: "recordingId",
          label: "Recording Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPitchName",
          label: "Supplied Pitch Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "namingSource",
          label: "Naming Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicTuningPitchNameVariantTool.execute;
export default publicTuningPitchNameVariantTool;
