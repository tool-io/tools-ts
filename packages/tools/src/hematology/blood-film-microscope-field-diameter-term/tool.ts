import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldNumberMm: number;
  readonly objectiveMagnification: number;
  readonly imageFraction: number;
};
export type Output = {
  readonly fieldDiameterMm: number;
  readonly sampledDiameterMm: number;
  readonly sampledAreaMm2: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldNumberMm: { type: "number", exclusiveMinimum: 0 },
    objectiveMagnification: { type: "number", exclusiveMinimum: 0 },
    imageFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["fieldNumberMm", "objectiveMagnification", "imageFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldDiameterMm: { type: "number" },
    sampledDiameterMm: { type: "number" },
    sampledAreaMm2: { type: "number" },
  },
  required: ["fieldDiameterMm", "sampledDiameterMm", "sampledAreaMm2"],
} as const;
/** Nominal microscope field-number/objective diameter with a supplied imaged diameter fraction; no cell-count multiplier is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldNumberMm, objectiveMagnification, imageFraction } = request;
  const compute = (): Output => {
    H.positive(fieldNumberMm);
    H.positive(objectiveMagnification);
    H.probability(imageFraction);
    return {
      fieldDiameterMm: fieldNumberMm / objectiveMagnification,
      sampledDiameterMm:
        (fieldNumberMm * imageFraction) / objectiveMagnification,
      sampledAreaMm2:
        (Math.PI *
          ((fieldNumberMm * imageFraction) / objectiveMagnification) ** 2) /
        4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldNumberMm: 20, objectiveMagnification: 100, imageFraction: 1 },
  output: {
    fieldDiameterMm: 0.2,
    sampledDiameterMm: 0.2,
    sampledAreaMm2: 0.031415926535897934,
  },
} satisfies ToolExample<Input, Output>;
export const bloodFilmMicroscopeFieldDiameterTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hematology/blood-film-microscope-field-diameter-term",
      title: "Blood Film Microscope Field Diameter Term Tool",
      description:
        "Nominal microscope field-number/objective diameter with a supplied imaged diameter fraction; no cell-count multiplier is assumed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fieldNumberMm: { type: "number", exclusiveMinimum: 0 },
          objectiveMagnification: { type: "number", exclusiveMinimum: 0 },
          imageFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["fieldNumberMm", "objectiveMagnification", "imageFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fieldDiameterMm: { type: "number" },
          sampledDiameterMm: { type: "number" },
          sampledAreaMm2: { type: "number" },
        },
        required: ["fieldDiameterMm", "sampledDiameterMm", "sampledAreaMm2"],
      },
      ports: {
        inputs: [
          {
            id: "fieldNumberMm",
            label: "Field Number Mm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "objectiveMagnification",
            label: "Objective Magnification",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "imageFraction",
            label: "Image Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fieldDiameterMm",
            label: "Field Diameter Mm",
            valueType: { type: "number" },
          },
          {
            id: "sampledDiameterMm",
            label: "Sampled Diameter Mm",
            valueType: { type: "number" },
          },
          {
            id: "sampledAreaMm2",
            label: "Sampled Area Mm2",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bloodFilmMicroscopeFieldDiameterTermTool.execute;
export default bloodFilmMicroscopeFieldDiameterTermTool;
