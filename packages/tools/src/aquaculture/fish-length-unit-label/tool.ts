import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly unit: string;
  readonly measurementType: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    unit: { type: "string", maxLength: 8192, enum: ["mm", "cm", "m"] },
    measurementType: {
      type: "string",
      maxLength: 8192,
      enum: ["total", "fork", "standard"],
    },
  },
  required: ["length", "unit", "measurementType"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a measured fish length with explicit unit and length convention without converting between total, fork and standard length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, unit, measurementType } = request;
  const compute = (): Output => {
    H.domain(length >= 0, "length");
    H.domain(["mm", "cm", "m"].includes(unit), "unit");
    H.domain(
      ["total", "fork", "standard"].includes(measurementType),
      "measurementType",
    );
    return { label: length + " " + unit + " " + measurementType + " length" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 18.5, unit: "cm", measurementType: "fork" },
  output: { label: "18.5 cm fork length" },
} satisfies ToolExample<Input, Output>;
export const fishLengthUnitLabelTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["aquaculture", "agriculture"],
        keywords: ["aquaculture", "agriculture"],
      },
      id: "aquaculture/fish-length-unit-label",
      title: "Fish Length Unit Label",
      description:
        "Label a measured fish length with explicit unit and length convention without converting between total, fork and standard length.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          length: { type: "number", minimum: 0 },
          unit: { type: "string", maxLength: 8192, enum: ["mm", "cm", "m"] },
          measurementType: {
            type: "string",
            maxLength: 8192,
            enum: ["total", "fork", "standard"],
          },
        },
        required: ["length", "unit", "measurementType"],
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
            id: "length",
            label: "Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unit",
            label: "Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "measurementType",
            label: "Measurement Type",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = fishLengthUnitLabelTool.execute;
export default fishLengthUnitLabelTool;
