import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedEffect: number;
  readonly unitFactor: number;
  readonly referenceEffect: number;
};
export type Output = {
  readonly convertedEffect: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedEffect: { type: "number" },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
    referenceEffect: { type: "number" },
  },
  required: ["reportedEffect", "unitFactor", "referenceEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedEffect: { type: "number" },
    residual: { type: "number" },
  },
  required: ["convertedEffect", "residual"],
} as const;
/** Compare an explicitly reported research effect under a supplied unit factor; no treatment efficacy is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedEffect, unitFactor, referenceEffect } = request;
  const compute = (): Output => {
    H.positive(unitFactor);
    return {
      convertedEffect: reportedEffect * unitFactor,
      residual: reportedEffect * unitFactor - referenceEffect,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedEffect: 2, unitFactor: 0.5, referenceEffect: 0.8 },
  output: { convertedEffect: 1, residual: 0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const claimEffectUnitReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/claim-effect-unit-reference-gap",
    title: "Claim Effect Unit Reference Gap Tool",
    description:
      "Compare an explicitly reported research effect under a supplied unit factor; no treatment efficacy is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedEffect: { type: "number" },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
        referenceEffect: { type: "number" },
      },
      required: ["reportedEffect", "unitFactor", "referenceEffect"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedEffect: { type: "number" },
        residual: { type: "number" },
      },
      required: ["convertedEffect", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "reportedEffect",
          label: "Reported Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEffect",
          label: "Reference Effect",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedEffect",
          label: "Converted Effect",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = claimEffectUnitReferenceGapTool.execute;
export default claimEffectUnitReferenceGapTool;
