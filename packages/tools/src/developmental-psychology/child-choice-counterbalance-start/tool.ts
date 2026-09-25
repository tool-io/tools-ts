import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trial: number;
  readonly conditionCount: number;
  readonly startCondition: number;
};
export type Output = { readonly condition: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trial: { type: "integer", minimum: 0 },
    conditionCount: { type: "integer", minimum: 1, maximum: 256 },
    startCondition: { type: "integer", minimum: 0 },
  },
  required: ["trial", "conditionCount", "startCondition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { condition: { type: "integer" } },
  required: ["condition"],
} as const;
/** Deterministic research-condition cycling from an explicit start, not randomized treatment assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trial, conditionCount, startCondition } = request;
  const compute = (): Output => {
    H.integer(trial, 0);
    H.integer(conditionCount, 1, 256);
    H.integer(startCondition, 0, conditionCount - 1);
    return {
      condition: ((trial % conditionCount) + startCondition) % conditionCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trial: 5, conditionCount: 3, startCondition: 1 },
  output: { condition: 0 },
} satisfies ToolExample<Input, Output>;
export const childChoiceCounterbalanceStartTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-choice-counterbalance-start",
    title: "Child Choice Counterbalance Start Tool",
    description:
      "Deterministic research-condition cycling from an explicit start, not randomized treatment assignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trial: { type: "integer", minimum: 0 },
        conditionCount: { type: "integer", minimum: 1, maximum: 256 },
        startCondition: { type: "integer", minimum: 0 },
      },
      required: ["trial", "conditionCount", "startCondition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { condition: { type: "integer" } },
      required: ["condition"],
    },
    ports: {
      inputs: [
        {
          id: "trial",
          label: "Trial",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "conditionCount",
          label: "Condition Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "startCondition",
          label: "Start Condition",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "condition", label: "Condition", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = childChoiceCounterbalanceStartTool.execute;
export default childChoiceCounterbalanceStartTool;
