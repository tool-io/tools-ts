import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly behaviorSeconds: number;
  readonly observableAtRiskSeconds: number;
};
export type Output = {
  readonly behaviorFraction: number;
  readonly otherObservedSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    behaviorSeconds: { type: "number", minimum: 0 },
    observableAtRiskSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["behaviorSeconds", "observableAtRiskSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    behaviorFraction: { type: "number" },
    otherObservedSeconds: { type: "number" },
  },
  required: ["behaviorFraction", "otherObservedSeconds"],
} as const;
/** Normalize an observed behavior duration by its explicitly observable at-risk interval without inferring unobserved behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { behaviorSeconds, observableAtRiskSeconds } = request;
  const compute = (): Output => {
    (H.domain(observableAtRiskSeconds > 0, "observableAtRiskSeconds"),
      observableAtRiskSeconds);
    H.domain(
      behaviorSeconds >= 0 && behaviorSeconds <= observableAtRiskSeconds,
      "behaviorSeconds",
    );
    return {
      behaviorFraction: behaviorSeconds / observableAtRiskSeconds,
      otherObservedSeconds: observableAtRiskSeconds - behaviorSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { behaviorSeconds: 45, observableAtRiskSeconds: 180 },
  output: { behaviorFraction: 0.25, otherObservedSeconds: 135 },
} satisfies ToolExample<Input, Output>;
export const behaviorDurationAtRiskFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/behavior-duration-at-risk-fraction",
    title: "Behavior Duration At Risk Fraction",
    description:
      "Normalize an observed behavior duration by its explicitly observable at-risk interval without inferring unobserved behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        behaviorSeconds: { type: "number", minimum: 0 },
        observableAtRiskSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["behaviorSeconds", "observableAtRiskSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        behaviorFraction: { type: "number" },
        otherObservedSeconds: { type: "number" },
      },
      required: ["behaviorFraction", "otherObservedSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "behaviorSeconds",
          label: "Behavior Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observableAtRiskSeconds",
          label: "Observable At Risk Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "behaviorFraction",
          label: "Behavior Fraction",
          valueType: { type: "number" },
        },
        {
          id: "otherObservedSeconds",
          label: "Other Observed Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = behaviorDurationAtRiskFractionTool.execute;
export default behaviorDurationAtRiskFractionTool;
