import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assessed: boolean;
  readonly bleedingRecorded: boolean;
};
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessed: { type: "boolean" },
    bleedingRecorded: { type: "boolean" },
  },
  required: ["assessed", "bleedingRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Encode explicit periodontal bleeding assessment flags without examining a site or assigning a clinical index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assessed, bleedingRecorded } = request;
  const compute = (): Output => {
    H.domain(assessed || !bleedingRecorded, "bleedingRecorded");
    return {
      code: !assessed
        ? "not-assessed"
        : bleedingRecorded
          ? "recorded-present"
          : "recorded-absent",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assessed: true, bleedingRecorded: true },
  output: { code: "recorded-present" },
} satisfies ToolExample<Input, Output>;
export const periodontalBleedingObservationCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["periodontology", "health and medicine"],
      keywords: ["periodontology", "health and medicine"],
    },
    id: "periodontology/periodontal-bleeding-observation-code",
    title: "Periodontal Bleeding Observation Code",
    description:
      "Encode explicit periodontal bleeding assessment flags without examining a site or assigning a clinical index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assessed: { type: "boolean" },
        bleedingRecorded: { type: "boolean" },
      },
      required: ["assessed", "bleedingRecorded"],
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
          id: "assessed",
          label: "Assessed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "bleedingRecorded",
          label: "Bleeding Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = periodontalBleedingObservationCodeTool.execute;
export default periodontalBleedingObservationCodeTool;
