import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly state: number;
  readonly input: number;
  readonly timeConstant: number;
  readonly step: number;
};
export type Output = { readonly retention: number; readonly nextState: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    state: { type: "number" },
    input: { type: "number" },
    timeConstant: { type: "number", exclusiveMinimum: 0 },
    step: { type: "number", minimum: 0 },
  },
  required: ["state", "input", "timeConstant", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { retention: { type: "number" }, nextState: { type: "number" } },
  required: ["retention", "nextState"],
} as const;
/** Exact constant-input first-order lag step; expm1 retains small-step increments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { state, input, timeConstant, step } = request;
  const compute = (): Output => {
    H.positive(timeConstant);
    H.domain(step >= 0);
    return {
      retention: Math.exp(-step / timeConstant),
      nextState: state + (input - state) * -Math.expm1(-step / timeConstant),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { state: 2, input: 10, timeConstant: 1, step: 0.6931471805599453 },
  output: { retention: 0.5, nextState: 6 },
} satisfies ToolExample<Input, Output>;
export const firstOrderLagExactStepCoefficientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/first-order-lag-exact-step-coefficient",
    title: "First Order Lag Exact Step Coefficient Tool",
    description:
      "Exact constant-input first-order lag step; expm1 retains small-step increments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        state: { type: "number" },
        input: { type: "number" },
        timeConstant: { type: "number", exclusiveMinimum: 0 },
        step: { type: "number", minimum: 0 },
      },
      required: ["state", "input", "timeConstant", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retention: { type: "number" },
        nextState: { type: "number" },
      },
      required: ["retention", "nextState"],
    },
    ports: {
      inputs: [
        {
          id: "state",
          label: "State",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "input",
          label: "Input",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeConstant",
          label: "Time Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "retention", label: "Retention", valueType: { type: "number" } },
        { id: "nextState", label: "Next State", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = firstOrderLagExactStepCoefficientTool.execute;
export default firstOrderLagExactStepCoefficientTool;
