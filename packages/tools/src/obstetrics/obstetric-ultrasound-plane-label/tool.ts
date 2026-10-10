import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly recordedPlane: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedPlane: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["imageId", "recordedPlane", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit obstetric ultrasound plane wording without detecting a plane or assessing an examination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, recordedPlane, source } = request;
  const compute = (): Output => {
    H.domain(
      imageId.length > 0 && recordedPlane.length > 0 && source.length > 0,
      "imageId",
    );
    return {
      label:
        imageId +
        "; plane=" +
        JSON.stringify(recordedPlane) +
        " [" +
        source +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageId: "IMG17",
    recordedPlane: "plane A",
    source: "Operator record",
  },
  output: { label: 'IMG17; plane="plane A" [Operator record]' },
} satisfies ToolExample<Input, Output>;
export const obstetricUltrasoundPlaneLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["obstetrics", "health and medicine"],
      keywords: ["obstetrics", "health and medicine"],
    },
    id: "obstetrics/obstetric-ultrasound-plane-label",
    title: "Obstetric Ultrasound Plane Label",
    description:
      "Label explicit obstetric ultrasound plane wording without detecting a plane or assessing an examination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedPlane: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["imageId", "recordedPlane", "source"],
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
          id: "imageId",
          label: "Image Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedPlane",
          label: "Recorded Plane",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = obstetricUltrasoundPlaneLabelTool.execute;
export default obstetricUltrasoundPlaneLabelTool;
