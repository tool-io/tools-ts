import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly openingMillimeters: number;
  readonly measurementWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    openingMillimeters: { type: "number", minimum: 0 },
    measurementWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "openingMillimeters", "measurementWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit mouth-opening measurement and convention without assessing functional limitation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, openingMillimeters, measurementWording } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && measurementWording.length > 0, "recordId");
    H.domain(openingMillimeters >= 0, "openingMillimeters");
    return {
      label:
        recordId +
        "; opening=" +
        openingMillimeters +
        " mm [" +
        measurementWording +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "M17",
    openingMillimeters: 35,
    measurementWording: "recorded point A",
  },
  output: { label: "M17; opening=35 mm [recorded point A]" },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryMouthOpeningPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oral-surgery", "oral surgery", "health and medicine"],
      keywords: ["oral surgery", "health and medicine"],
    },
    id: "oral-surgery/oral-surgery-mouth-opening-point",
    title: "Oral Surgery Mouth Opening Point",
    description:
      "Label an explicit mouth-opening measurement and convention without assessing functional limitation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        openingMillimeters: { type: "number", minimum: 0 },
        measurementWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "openingMillimeters", "measurementWording"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "openingMillimeters",
          label: "Opening Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurementWording",
          label: "Measurement Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oralSurgeryMouthOpeningPointTool.execute;
export default oralSurgeryMouthOpeningPointTool;
