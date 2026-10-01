import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDistance: number;
  readonly referenceLetterHeight: number;
  readonly targetDistance: number;
};
export type Output = {
  readonly scale: number;
  readonly targetLetterHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDistance: { type: "number", exclusiveMinimum: 0 },
    referenceLetterHeight: { type: "number", minimum: 0 },
    targetDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["referenceDistance", "referenceLetterHeight", "targetDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scale: { type: "number" },
    targetLetterHeight: { type: "number" },
  },
  required: ["scale", "targetLetterHeight"],
} as const;
/** Geometric equal-angular-size chart scaling, without asserting clinical equivalence between chart designs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDistance, referenceLetterHeight, targetDistance } = request;
  const compute = (): Output => {
    H.positive(referenceDistance);
    H.positive(targetDistance);
    H.domain(referenceLetterHeight >= 0);
    return {
      scale: targetDistance / referenceDistance,
      targetLetterHeight:
        (referenceLetterHeight * targetDistance) / referenceDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceDistance: 6, referenceLetterHeight: 10, targetDistance: 3 },
  output: { scale: 0.5, targetLetterHeight: 5 },
} satisfies ToolExample<Input, Output>;
export const ophthalmicChartDistanceLetterHeightFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ophthalmology/ophthalmic-chart-distance-letter-height-factor",
      title: "Ophthalmic Chart Distance Letter Height Factor Tool",
      description:
        "Geometric equal-angular-size chart scaling, without asserting clinical equivalence between chart designs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceDistance: { type: "number", exclusiveMinimum: 0 },
          referenceLetterHeight: { type: "number", minimum: 0 },
          targetDistance: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "referenceDistance",
          "referenceLetterHeight",
          "targetDistance",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scale: { type: "number" },
          targetLetterHeight: { type: "number" },
        },
        required: ["scale", "targetLetterHeight"],
      },
      ports: {
        inputs: [
          {
            id: "referenceDistance",
            label: "Reference Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceLetterHeight",
            label: "Reference Letter Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetDistance",
            label: "Target Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "scale", label: "Scale", valueType: { type: "number" } },
          {
            id: "targetLetterHeight",
            label: "Target Letter Height",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ophthalmicChartDistanceLetterHeightFactorTool.execute;
export default ophthalmicChartDistanceLetterHeightFactorTool;
