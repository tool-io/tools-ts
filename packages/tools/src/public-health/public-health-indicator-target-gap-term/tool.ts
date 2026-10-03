import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly target: number;
  readonly higherBetter: boolean;
  readonly scale: number;
};
export type Output = {
  readonly signedGap: number;
  readonly favorableMargin: number;
  readonly normalizedMargin: number;
  readonly meets: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    target: { type: "number" },
    higherBetter: { type: "boolean" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "target", "higherBetter", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    favorableMargin: { type: "number" },
    normalizedMargin: { type: "number" },
    meets: { type: "boolean" },
  },
  required: ["signedGap", "favorableMargin", "normalizedMargin", "meets"],
} as const;
/** Direction-aware target distance under an explicit indicator scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, target, higherBetter, scale } = request;
  const compute = (): Output => {
    H.positive(scale);
    return {
      signedGap: observed - target,
      favorableMargin: (higherBetter ? 1 : -1) * (observed - target),
      normalizedMargin: ((higherBetter ? 1 : -1) * (observed - target)) / scale,
      meets: higherBetter ? observed >= target : observed <= target,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 80, target: 90, higherBetter: true, scale: 10 },
  output: {
    signedGap: -10,
    favorableMargin: -10,
    normalizedMargin: -1,
    meets: false,
  },
} satisfies ToolExample<Input, Output>;
export const publicHealthIndicatorTargetGapTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/public-health-indicator-target-gap-term",
    title: "Public Health Indicator Target Gap Term Tool",
    description:
      "Direction-aware target distance under an explicit indicator scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        target: { type: "number" },
        higherBetter: { type: "boolean" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observed", "target", "higherBetter", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "number" },
        favorableMargin: { type: "number" },
        normalizedMargin: { type: "number" },
        meets: { type: "boolean" },
      },
      required: ["signedGap", "favorableMargin", "normalizedMargin", "meets"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherBetter",
          label: "Higher Better",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        {
          id: "favorableMargin",
          label: "Favorable Margin",
          valueType: { type: "number" },
        },
        {
          id: "normalizedMargin",
          label: "Normalized Margin",
          valueType: { type: "number" },
        },
        { id: "meets", label: "Meets", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = publicHealthIndicatorTargetGapTermTool.execute;
export default publicHealthIndicatorTargetGapTermTool;
