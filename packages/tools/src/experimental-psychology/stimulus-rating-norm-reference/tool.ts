import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulusCode: string;
  readonly normSource: string;
  readonly normVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusCode: { type: "string", maxLength: 8192, minLength: 1 },
    normSource: { type: "string", maxLength: 8192, minLength: 1 },
    normVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["stimulusCode", "normSource", "normVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record the supplied norm-source reference for a stimulus without providing a normative rating. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimulusCode, normSource, normVersion } = request;
  const compute = (): Output => {
    H.domain(stimulusCode.length > 0, "stimulusCode");
    H.domain(normSource.length > 0, "normSource");
    H.domain(normVersion.length > 0, "normVersion");
    return { token: JSON.stringify([stimulusCode, normSource, normVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stimulusCode: "IMG17", normSource: "Dataset A", normVersion: "v3" },
  output: { token: '["IMG17","Dataset A","v3"]' },
} satisfies ToolExample<Input, Output>;
export const stimulusRatingNormReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "experimental-psychology",
        "experimental psychology",
        "psychology",
      ],
      keywords: ["experimental psychology", "psychology"],
    },
    id: "experimental-psychology/stimulus-rating-norm-reference",
    title: "Stimulus Rating Norm Reference",
    description:
      "Record the supplied norm-source reference for a stimulus without providing a normative rating.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusCode: { type: "string", maxLength: 8192, minLength: 1 },
        normSource: { type: "string", maxLength: 8192, minLength: 1 },
        normVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["stimulusCode", "normSource", "normVersion"],
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
          id: "stimulusCode",
          label: "Stimulus Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "normSource",
          label: "Norm Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "normVersion",
          label: "Norm Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = stimulusRatingNormReferenceTool.execute;
export default stimulusRatingNormReferenceTool;
