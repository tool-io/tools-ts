import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bodyPixels: number;
  readonly rulerPixels: number;
  readonly suppliedRulerLength: number;
};
export type Output = {
  readonly physicalLength: number;
  readonly lengthPerPixel: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bodyPixels: { type: "number", minimum: 0 },
    rulerPixels: { type: "number", exclusiveMinimum: 0 },
    suppliedRulerLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["bodyPixels", "rulerPixels", "suppliedRulerLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalLength: { type: "number" },
    lengthPerPixel: { type: "number" },
  },
  required: ["physicalLength", "lengthPerPixel"],
} as const;
/** Derive image-to-physical body length from an explicit ruler, with no preservative correction or species norm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bodyPixels, rulerPixels, suppliedRulerLength } = request;
  const compute = (): Output => {
    H.domain(bodyPixels >= 0);
    H.positive(rulerPixels);
    H.positive(suppliedRulerLength);
    return {
      physicalLength: (bodyPixels * suppliedRulerLength) / rulerPixels,
      lengthPerPixel: suppliedRulerLength / rulerPixels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bodyPixels: 40, rulerPixels: 20, suppliedRulerLength: 5 },
  output: { physicalLength: 10, lengthPerPixel: 0.25 },
} satisfies ToolExample<Input, Output>;
export const insectBodyLengthScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-body-length-scale-factor",
    title: "Insect Body Length Scale Factor Tool",
    description:
      "Derive image-to-physical body length from an explicit ruler, with no preservative correction or species norm.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bodyPixels: { type: "number", minimum: 0 },
        rulerPixels: { type: "number", exclusiveMinimum: 0 },
        suppliedRulerLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["bodyPixels", "rulerPixels", "suppliedRulerLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physicalLength: { type: "number" },
        lengthPerPixel: { type: "number" },
      },
      required: ["physicalLength", "lengthPerPixel"],
    },
    ports: {
      inputs: [
        {
          id: "bodyPixels",
          label: "Body Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rulerPixels",
          label: "Ruler Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRulerLength",
          label: "Supplied Ruler Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalLength",
          label: "Physical Length",
          valueType: { type: "number" },
        },
        {
          id: "lengthPerPixel",
          label: "Length Per Pixel",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectBodyLengthScaleFactorTool.execute;
export default insectBodyLengthScaleFactorTool;
