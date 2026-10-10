import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly correctionStatus: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    correctionStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["uncorrected", "corrected", "unspecified"],
    },
  },
  required: ["recordId", "correctionStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label explicitly recorded optical correction status without interpreting acuity or treatment effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, correctionStatus } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["uncorrected", "corrected", "unspecified"].includes(correctionStatus),
      "correctionStatus",
    );
    return { tag: recordId + " [" + correctionStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", correctionStatus: "corrected" },
  output: { tag: "R17 [corrected]" },
} satisfies ToolExample<Input, Output>;
export const optometricUncorrectedcorrectedTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["optometry", "health and medicine"],
      keywords: ["optometry", "health and medicine"],
    },
    id: "optometry/optometric-uncorrected-corrected-tag",
    title: "Optometric Uncorrected or Corrected Tag",
    description:
      "Label explicitly recorded optical correction status without interpreting acuity or treatment effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        correctionStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["uncorrected", "corrected", "unspecified"],
        },
      },
      required: ["recordId", "correctionStatus"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "correctionStatus",
          label: "Correction Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = optometricUncorrectedcorrectedTagTool.execute;
export default optometricUncorrectedcorrectedTagTool;
