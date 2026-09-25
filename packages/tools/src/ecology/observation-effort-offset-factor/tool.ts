import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effort: number;
  readonly referenceEffort: number;
  readonly observations: number;
};
export type Output = {
  readonly effortFactor: number;
  readonly referenceEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effort: { type: "number", exclusiveMinimum: 0 },
    referenceEffort: { type: "number", exclusiveMinimum: 0 },
    observations: { type: "integer", minimum: 0 },
  },
  required: ["effort", "referenceEffort", "observations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effortFactor: { type: "number" },
    referenceEquivalent: { type: "number" },
  },
  required: ["effortFactor", "referenceEquivalent"],
} as const;
/** Show a constant-observation-rate effort normalization scenario without claiming effort-invariant ecological abundance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effort, referenceEffort, observations } = request;
  const compute = (): Output => {
    H.positive(effort);
    H.positive(referenceEffort);
    H.integer(observations, 0);
    return {
      effortFactor: referenceEffort / effort,
      referenceEquivalent: (observations * referenceEffort) / effort,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effort: 5, referenceEffort: 10, observations: 20 },
  output: { effortFactor: 2, referenceEquivalent: 40 },
} satisfies ToolExample<Input, Output>;
export const observationEffortOffsetFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/observation-effort-offset-factor",
    title: "Observation Effort Offset Factor Tool",
    description:
      "Show a constant-observation-rate effort normalization scenario without claiming effort-invariant ecological abundance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effort: { type: "number", exclusiveMinimum: 0 },
        referenceEffort: { type: "number", exclusiveMinimum: 0 },
        observations: { type: "integer", minimum: 0 },
      },
      required: ["effort", "referenceEffort", "observations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effortFactor: { type: "number" },
        referenceEquivalent: { type: "number" },
      },
      required: ["effortFactor", "referenceEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "effort",
          label: "Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEffort",
          label: "Reference Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observations",
          label: "Observations",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "effortFactor",
          label: "Effort Factor",
          valueType: { type: "number" },
        },
        {
          id: "referenceEquivalent",
          label: "Reference Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = observationEffortOffsetFactorTool.execute;
export default observationEffortOffsetFactorTool;
