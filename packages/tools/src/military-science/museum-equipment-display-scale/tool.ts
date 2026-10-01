import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelLength: number;
  readonly actualLength: number;
};
export type Output = {
  readonly scaleFraction: number;
  readonly scaleDenominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelLength: { type: "number", exclusiveMinimum: 0 },
    actualLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["modelLength", "actualLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleFraction: { type: "number" },
    scaleDenominator: { type: "number" },
  },
  required: ["scaleFraction", "scaleDenominator"],
} as const;
/** Calculate a museum display scale from supplied same-unit dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modelLength, actualLength } = request;
  const compute = (): Output => {
    H.positive(modelLength);
    H.positive(actualLength);
    return {
      scaleFraction: modelLength / actualLength,
      scaleDenominator: actualLength / modelLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modelLength: 2, actualLength: 100 },
  output: { scaleFraction: 0.02, scaleDenominator: 50 },
} satisfies ToolExample<Input, Output>;
export const museumEquipmentDisplayScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/museum-equipment-display-scale",
    title: "Museum Equipment Display Scale Tool",
    description:
      "Calculate a museum display scale from supplied same-unit dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelLength: { type: "number", exclusiveMinimum: 0 },
        actualLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["modelLength", "actualLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleFraction: { type: "number" },
        scaleDenominator: { type: "number" },
      },
      required: ["scaleFraction", "scaleDenominator"],
    },
    ports: {
      inputs: [
        {
          id: "modelLength",
          label: "Model Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualLength",
          label: "Actual Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaleFraction",
          label: "Scale Fraction",
          valueType: { type: "number" },
        },
        {
          id: "scaleDenominator",
          label: "Scale Denominator",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = museumEquipmentDisplayScaleTool.execute;
export default museumEquipmentDisplayScaleTool;
