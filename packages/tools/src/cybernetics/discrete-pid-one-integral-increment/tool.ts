import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integral: number;
  readonly error: number;
  readonly gain: number;
  readonly step: number;
};
export type Output = {
  readonly increment: number;
  readonly nextIntegral: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integral: { type: "number" },
    error: { type: "number" },
    gain: { type: "number" },
    step: { type: "number", minimum: 0 },
  },
  required: ["integral", "error", "gain", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    increment: { type: "number" },
    nextIntegral: { type: "number" },
  },
  required: ["increment", "nextIntegral"],
} as const;
/** Forward rectangular integration of an explicitly supplied current PID error. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integral, error, gain, step } = request;
  const compute = (): Output => {
    H.domain(step >= 0);
    return {
      increment: gain * error * step,
      nextIntegral: integral + gain * error * step,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integral: 2, error: 3, gain: 0.5, step: 2 },
  output: { increment: 3, nextIntegral: 5 },
} satisfies ToolExample<Input, Output>;
export const discretePidOneIntegralIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/discrete-pid-one-integral-increment",
    title: "Discrete Pid One Integral Increment Tool",
    description:
      "Forward rectangular integration of an explicitly supplied current PID error.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integral: { type: "number" },
        error: { type: "number" },
        gain: { type: "number" },
        step: { type: "number", minimum: 0 },
      },
      required: ["integral", "error", "gain", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        increment: { type: "number" },
        nextIntegral: { type: "number" },
      },
      required: ["increment", "nextIntegral"],
    },
    ports: {
      inputs: [
        {
          id: "integral",
          label: "Integral",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "error",
          label: "Error",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gain",
          label: "Gain",
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
        { id: "increment", label: "Increment", valueType: { type: "number" } },
        {
          id: "nextIntegral",
          label: "Next Integral",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = discretePidOneIntegralIncrementTool.execute;
export default discretePidOneIntegralIncrementTool;
