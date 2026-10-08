import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly cloudFlagCode: string;
  readonly cloudFlagSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    cloudFlagCode: { type: "string", maxLength: 8192, minLength: 1 },
    cloudFlagSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "cloudFlagCode", "cloudFlagSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied cloud-flag code and source without deriving cloud conditions from imagery. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, cloudFlagCode, cloudFlagSource } = request;
  const compute = (): Output => {
    H.domain(
      observationId.length > 0 &&
        cloudFlagCode.length > 0 &&
        cloudFlagSource.length > 0,
      "observationId",
    );
    return {
      label:
        observationId +
        "; cloud=" +
        JSON.stringify(cloudFlagCode) +
        " [" +
        cloudFlagSource +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "OBS17",
    cloudFlagCode: "CLOUD",
    cloudFlagSource: "Product A v2",
  },
  output: { label: 'OBS17; cloud="CLOUD" [Product A v2]' },
} satisfies ToolExample<Input, Output>;
export const earthObservationCloudFlagLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "earth-science",
        "earth science",
        "earth and environmental sciences",
      ],
      keywords: ["earth science", "earth and environmental sciences"],
    },
    id: "earth-science/earth-observation-cloud-flag-label",
    title: "Earth Observation Cloud Flag Label",
    description:
      "Label a supplied cloud-flag code and source without deriving cloud conditions from imagery.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        cloudFlagCode: { type: "string", maxLength: 8192, minLength: 1 },
        cloudFlagSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "cloudFlagCode", "cloudFlagSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cloudFlagCode",
          label: "Cloud Flag Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cloudFlagSource",
          label: "Cloud Flag Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = earthObservationCloudFlagLabelTool.execute;
export default earthObservationCloudFlagLabelTool;
