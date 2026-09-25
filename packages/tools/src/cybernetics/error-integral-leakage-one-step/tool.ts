import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integral: number;
  readonly error: number;
  readonly retention: number;
  readonly gain: number;
  readonly step: number;
};
export type Output = { readonly next: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integral: { type: "number" },
    error: { type: "number" },
    retention: { type: "number", minimum: 0, maximum: 1 },
    gain: { type: "number" },
    step: { type: "number", minimum: 0 },
  },
  required: ["integral", "error", "retention", "gain", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { next: { type: "number" } },
  required: ["next"],
} as const;
/** Calculate error integral leakage one step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integral, error, retention, gain, step } = request;
  const compute = (): Output => {
    H.probability(retention);
    H.domain(step >= 0);
    return { next: retention * integral + gain * error * step };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integral: 10, error: 2, retention: 0.9, gain: 1, step: 1 },
  output: { next: 11 },
} satisfies ToolExample<Input, Output>;
export const errorIntegralLeakageOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/error-integral-leakage-one-step",
    title: "Error Integral Leakage One Step Tool",
    description:
      "Calculate error integral leakage one step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integral: { type: "number" },
        error: { type: "number" },
        retention: { type: "number", minimum: 0, maximum: 1 },
        gain: { type: "number" },
        step: { type: "number", minimum: 0 },
      },
      required: ["integral", "error", "retention", "gain", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { next: { type: "number" } },
      required: ["next"],
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
          id: "retention",
          label: "Retention",
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
      outputs: [{ id: "next", label: "Next", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = errorIntegralLeakageOneStepTool.execute;
export default errorIntegralLeakageOneStepTool;
