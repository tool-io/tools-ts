import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly groundSampleValueText: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    groundSampleValueText: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["imageId", "groundSampleValueText", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit image ground-sample distance text and unit without estimating spatial resolution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, groundSampleValueText, unitText } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0, "imageId");
    H.domain(groundSampleValueText.length > 0, "groundSampleValueText");
    H.domain(unitText.length > 0, "unitText");
    return {
      token: JSON.stringify([imageId, groundSampleValueText, unitText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageId: "IMG17",
    groundSampleValueText: "2.5",
    unitText: "cm/pixel",
  },
  output: { token: '["IMG17","2.5","cm/pixel"]' },
} satisfies ToolExample<Input, Output>;
export const droneGroundSampleUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["precision-agriculture", "precision agriculture", "agriculture"],
      keywords: ["precision agriculture", "agriculture"],
    },
    id: "precision-agriculture/drone-ground-sample-unit",
    title: "Drone Ground Sample Unit",
    description:
      "Preserve explicit image ground-sample distance text and unit without estimating spatial resolution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        groundSampleValueText: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["imageId", "groundSampleValueText", "unitText"],
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
          id: "groundSampleValueText",
          label: "Ground Sample Value Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = droneGroundSampleUnitTool.execute;
export default droneGroundSampleUnitTool;
