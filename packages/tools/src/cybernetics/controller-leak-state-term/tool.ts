import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly state: number;
  readonly leakRate: number;
  readonly timeStep: number;
};
export type Output = { readonly newState: number; readonly decrement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    state: { type: "number" },
    leakRate: { type: "number", minimum: 0 },
    timeStep: { type: "number", minimum: 0 },
  },
  required: ["state", "leakRate", "timeStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newState: { type: "number" }, decrement: { type: "number" } },
  required: ["newState", "decrement"],
} as const;
/** Apply exact exponential zero-input leakage, not a forward Euler state update. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { state, leakRate, timeStep } = request;
  const compute = (): Output => {
    H.domain(leakRate >= 0 && timeStep >= 0);
    return {
      newState: state * Math.exp(-leakRate * timeStep),
      decrement: state * -Math.expm1(-leakRate * timeStep),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { state: 10, leakRate: 0, timeStep: 2 },
  output: { newState: 10, decrement: 0 },
} satisfies ToolExample<Input, Output>;
export const controllerLeakStateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/controller-leak-state-term",
    title: "Controller Leak State Term Tool",
    description:
      "Apply exact exponential zero-input leakage, not a forward Euler state update.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        state: { type: "number" },
        leakRate: { type: "number", minimum: 0 },
        timeStep: { type: "number", minimum: 0 },
      },
      required: ["state", "leakRate", "timeStep"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newState: { type: "number" },
        decrement: { type: "number" },
      },
      required: ["newState", "decrement"],
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
          id: "leakRate",
          label: "Leak Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeStep",
          label: "Time Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "newState", label: "New State", valueType: { type: "number" } },
        { id: "decrement", label: "Decrement", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = controllerLeakStateTermTool.execute;
export default controllerLeakStateTermTool;
