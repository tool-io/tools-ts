import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly measurementName: string;
  readonly side: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    measurementName: { type: "string", maxLength: 8192, minLength: 1 },
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "midline", "unspecified"],
    },
  },
  required: ["specimenId", "measurementName", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit laterality label to an animal specimen measurement without interpreting anatomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, measurementName, side } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0 && measurementName.length > 0, "specimenId");
    H.domain(
      ["left", "right", "midline", "unspecified"].includes(side),
      "side",
    );
    return { label: specimenId + "; " + measurementName + " [" + side + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "Z17", measurementName: "wing length", side: "left" },
  output: { label: "Z17; wing length [left]" },
} satisfies ToolExample<Input, Output>;
export const animalSpecimenMeasurementSideTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["zoology", "biology"],
      keywords: ["zoology", "biology"],
    },
    id: "zoology/animal-specimen-measurement-side",
    title: "Animal Specimen Measurement Side",
    description:
      "Attach an explicit laterality label to an animal specimen measurement without interpreting anatomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        measurementName: { type: "string", maxLength: 8192, minLength: 1 },
        side: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "midline", "unspecified"],
        },
      },
      required: ["specimenId", "measurementName", "side"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "measurementName",
          label: "Measurement Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = animalSpecimenMeasurementSideTool.execute;
export default animalSpecimenMeasurementSideTool;
