import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMass: number;
  readonly shrinkFraction: number;
  readonly restoreToPreShrink: boolean;
};
export type Output = {
  readonly adjustedMass: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMass: { type: "number", minimum: 0 },
    shrinkFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    restoreToPreShrink: { type: "boolean" },
  },
  required: ["observedMass", "shrinkFraction", "restoreToPreShrink"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedMass: { type: "number" },
    difference: { type: "number" },
  },
  required: ["adjustedMass", "difference"],
} as const;
/** Explicit shrink-factor arithmetic; the caller selects whether to restore a shrunk observation or project shrink. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMass, shrinkFraction, restoreToPreShrink } = request;
  const compute = (): Output => {
    H.domain(observedMass >= 0 && shrinkFraction >= 0 && shrinkFraction < 1);
    return {
      adjustedMass: restoreToPreShrink
        ? observedMass / (1 - shrinkFraction)
        : observedMass * (1 - shrinkFraction),
      difference: restoreToPreShrink
        ? observedMass / (1 - shrinkFraction) - observedMass
        : -observedMass * shrinkFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMass: 90, shrinkFraction: 0.1, restoreToPreShrink: true },
  output: { adjustedMass: 100, difference: 10 },
} satisfies ToolExample<Input, Output>;
export const livestockWeighingTimeShrinkTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/livestock-weighing-time-shrink-term",
    title: "Livestock Weighing Time Shrink Term Tool",
    description:
      "Explicit shrink-factor arithmetic; the caller selects whether to restore a shrunk observation or project shrink.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMass: { type: "number", minimum: 0 },
        shrinkFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        restoreToPreShrink: { type: "boolean" },
      },
      required: ["observedMass", "shrinkFraction", "restoreToPreShrink"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedMass: { type: "number" },
        difference: { type: "number" },
      },
      required: ["adjustedMass", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "observedMass",
          label: "Observed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shrinkFraction",
          label: "Shrink Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restoreToPreShrink",
          label: "Restore To Pre Shrink",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "adjustedMass",
          label: "Adjusted Mass",
          valueType: { type: "number" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = livestockWeighingTimeShrinkTermTool.execute;
export default livestockWeighingTimeShrinkTermTool;
