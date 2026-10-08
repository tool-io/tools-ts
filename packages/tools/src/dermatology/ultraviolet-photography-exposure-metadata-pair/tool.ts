import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly suppliedExposureText: string;
  readonly filterSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedExposureText: { type: "string", maxLength: 8192, minLength: 1 },
    filterSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["imageId", "suppliedExposureText", "filterSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit ultraviolet photography exposure and filter metadata without prescribing exposure or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, suppliedExposureText, filterSource } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0, "imageId");
    H.domain(suppliedExposureText.length > 0, "suppliedExposureText");
    H.domain(filterSource.length > 0, "filterSource");
    return {
      token: JSON.stringify([imageId, suppliedExposureText, filterSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageId: "I17",
    suppliedExposureText: "1/30 s",
    filterSource: "filter F4",
  },
  output: { token: '["I17","1/30 s","filter F4"]' },
} satisfies ToolExample<Input, Output>;
export const ultravioletPhotographyExposureMetadataPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dermatology/ultraviolet-photography-exposure-metadata-pair",
      title: "Ultraviolet Photography Exposure Metadata Pair Tool",
      description:
        "Record explicit ultraviolet photography exposure and filter metadata without prescribing exposure or clinical interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          imageId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedExposureText: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          filterSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["imageId", "suppliedExposureText", "filterSource"],
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
            id: "imageId",
            label: "Image Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedExposureText",
            label: "Supplied Exposure Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "filterSource",
            label: "Filter Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = ultravioletPhotographyExposureMetadataPairTool.execute;
export default ultravioletPhotographyExposureMetadataPairTool;
