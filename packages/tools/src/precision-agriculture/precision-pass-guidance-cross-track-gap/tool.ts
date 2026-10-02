import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly crossTrackError: number;
  readonly corridorHalfwidth: number;
  readonly uncertainty: number;
};
export type Output = {
  readonly remainingMargin: number;
  readonly insideUnderBound: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crossTrackError: { type: "number" },
    corridorHalfwidth: { type: "number", minimum: 0 },
    uncertainty: { type: "number", minimum: 0 },
  },
  required: ["crossTrackError", "corridorHalfwidth", "uncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingMargin: { type: "number" },
    insideUnderBound: { type: "boolean" },
  },
  required: ["remainingMargin", "insideUnderBound"],
} as const;
/** Remaining margin to a supplied guidance corridor, not estimation of cross-track error. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { crossTrackError, corridorHalfwidth, uncertainty } = request;
  const compute = (): Output => {
    H.domain(corridorHalfwidth >= 0 && uncertainty >= 0);
    return {
      remainingMargin:
        corridorHalfwidth - Math.abs(crossTrackError) - uncertainty,
      insideUnderBound:
        Math.abs(crossTrackError) + uncertainty <= corridorHalfwidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { crossTrackError: 2, corridorHalfwidth: 5, uncertainty: 1 },
  output: { remainingMargin: 2, insideUnderBound: true },
} satisfies ToolExample<Input, Output>;
export const precisionPassGuidanceCrossTrackGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/precision-pass-guidance-cross-track-gap",
    title: "Precision Pass Guidance Cross Track Gap Tool",
    description:
      "Remaining margin to a supplied guidance corridor, not estimation of cross-track error.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crossTrackError: { type: "number" },
        corridorHalfwidth: { type: "number", minimum: 0 },
        uncertainty: { type: "number", minimum: 0 },
      },
      required: ["crossTrackError", "corridorHalfwidth", "uncertainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingMargin: { type: "number" },
        insideUnderBound: { type: "boolean" },
      },
      required: ["remainingMargin", "insideUnderBound"],
    },
    ports: {
      inputs: [
        {
          id: "crossTrackError",
          label: "Cross Track Error",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "corridorHalfwidth",
          label: "Corridor Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "uncertainty",
          label: "Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingMargin",
          label: "Remaining Margin",
          valueType: { type: "number" },
        },
        {
          id: "insideUnderBound",
          label: "Inside Under Bound",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = precisionPassGuidanceCrossTrackGapTool.execute;
export default precisionPassGuidanceCrossTrackGapTool;
