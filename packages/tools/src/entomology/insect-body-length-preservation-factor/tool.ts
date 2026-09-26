import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preservedLength: number;
  readonly retainedFraction: number;
  readonly uncertaintyFraction: number;
};
export type Output = {
  readonly estimatedOriginalLength: number;
  readonly lowerLength: number;
  readonly upperLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservedLength: { type: "number", minimum: 0 },
    retainedFraction: { type: "number", exclusiveMinimum: 0 },
    uncertaintyFraction: { type: "number", minimum: 0 },
  },
  required: ["preservedLength", "retainedFraction", "uncertaintyFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedOriginalLength: { type: "number" },
    lowerLength: { type: "number" },
    upperLength: { type: "number" },
  },
  required: ["estimatedOriginalLength", "lowerLength", "upperLength"],
} as const;
/** Explicit caller-supported preservation length factor and uncertainty interval; expansion factors over one remain possible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preservedLength, retainedFraction, uncertaintyFraction } = request;
  const compute = (): Output => {
    H.domain(
      preservedLength >= 0 &&
        retainedFraction > 0 &&
        uncertaintyFraction >= 0 &&
        retainedFraction > uncertaintyFraction,
    );
    return {
      estimatedOriginalLength: preservedLength / retainedFraction,
      lowerLength: preservedLength / (retainedFraction + uncertaintyFraction),
      upperLength: preservedLength / (retainedFraction - uncertaintyFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preservedLength: 9,
    retainedFraction: 0.9,
    uncertaintyFraction: 0.1,
  },
  output: { estimatedOriginalLength: 10, lowerLength: 9, upperLength: 11.25 },
} satisfies ToolExample<Input, Output>;
export const insectBodyLengthPreservationFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-body-length-preservation-factor",
    title: "Insect Body Length Preservation Factor Tool",
    description:
      "Explicit caller-supported preservation length factor and uncertainty interval; expansion factors over one remain possible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preservedLength: { type: "number", minimum: 0 },
        retainedFraction: { type: "number", exclusiveMinimum: 0 },
        uncertaintyFraction: { type: "number", minimum: 0 },
      },
      required: ["preservedLength", "retainedFraction", "uncertaintyFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedOriginalLength: { type: "number" },
        lowerLength: { type: "number" },
        upperLength: { type: "number" },
      },
      required: ["estimatedOriginalLength", "lowerLength", "upperLength"],
    },
    ports: {
      inputs: [
        {
          id: "preservedLength",
          label: "Preserved Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "uncertaintyFraction",
          label: "Uncertainty Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedOriginalLength",
          label: "Estimated Original Length",
          valueType: { type: "number" },
        },
        {
          id: "lowerLength",
          label: "Lower Length",
          valueType: { type: "number" },
        },
        {
          id: "upperLength",
          label: "Upper Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectBodyLengthPreservationFactorTool.execute;
export default insectBodyLengthPreservationFactorTool;
