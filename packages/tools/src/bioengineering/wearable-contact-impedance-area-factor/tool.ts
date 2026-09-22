import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly impedanceMagnitude: number;
  readonly contactArea: number;
  readonly targetArea: number;
};
export type Output = {
  readonly areaNormalizedImpedance: number;
  readonly predictedTargetImpedance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impedanceMagnitude: { type: "number", minimum: 0 },
    contactArea: { type: "number", exclusiveMinimum: 0 },
    targetArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["impedanceMagnitude", "contactArea", "targetArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaNormalizedImpedance: { type: "number" },
    predictedTargetImpedance: { type: "number" },
  },
  required: ["areaNormalizedImpedance", "predictedTargetImpedance"],
} as const;
/** Ideal inverse-area scaling at a fixed frequency and contact condition, not a complete electrode impedance model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { impedanceMagnitude, contactArea, targetArea } = request;
  const compute = (): Output => {
    H.domain(impedanceMagnitude >= 0);
    H.positive(contactArea);
    H.positive(targetArea);
    return {
      areaNormalizedImpedance: impedanceMagnitude * contactArea,
      predictedTargetImpedance: (impedanceMagnitude * contactArea) / targetArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { impedanceMagnitude: 1000, contactArea: 2, targetArea: 4 },
  output: { areaNormalizedImpedance: 2000, predictedTargetImpedance: 500 },
} satisfies ToolExample<Input, Output>;
export const wearableContactImpedanceAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/wearable-contact-impedance-area-factor",
    title: "Wearable Contact Impedance Area Factor Tool",
    description:
      "Ideal inverse-area scaling at a fixed frequency and contact condition, not a complete electrode impedance model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impedanceMagnitude: { type: "number", minimum: 0 },
        contactArea: { type: "number", exclusiveMinimum: 0 },
        targetArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["impedanceMagnitude", "contactArea", "targetArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaNormalizedImpedance: { type: "number" },
        predictedTargetImpedance: { type: "number" },
      },
      required: ["areaNormalizedImpedance", "predictedTargetImpedance"],
    },
    ports: {
      inputs: [
        {
          id: "impedanceMagnitude",
          label: "Impedance Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactArea",
          label: "Contact Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetArea",
          label: "Target Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaNormalizedImpedance",
          label: "Area Normalized Impedance",
          valueType: { type: "number" },
        },
        {
          id: "predictedTargetImpedance",
          label: "Predicted Target Impedance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wearableContactImpedanceAreaFactorTool.execute;
export default wearableContactImpedanceAreaFactorTool;
