import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angularFrequency: number;
  readonly delay: number;
  readonly convention: string;
};
export type Output = { readonly phaseShift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularFrequency: { type: "number" },
    delay: { type: "number", minimum: 0 },
    convention: {
      type: "string",
      maxLength: 8192,
      enum: ["exp-positive", "exp-negative"],
    },
  },
  required: ["angularFrequency", "delay", "convention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseShift: { type: "number" } },
  required: ["phaseShift"],
} as const;
/** Phase of a pure supplied delay under an explicit Fourier-sign convention; no hold transfer function approximation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angularFrequency, delay, convention } = request;
  const compute = (): Output => {
    H.domain(
      delay >= 0 && ["exp-positive", "exp-negative"].includes(convention),
    );
    return {
      phaseShift:
        (convention === "exp-positive" ? -1 : 1) * angularFrequency * delay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angularFrequency: 2, delay: 0.5, convention: "exp-positive" },
  output: { phaseShift: -1 },
} satisfies ToolExample<Input, Output>;
export const sampleHoldDelayPhaseSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/sample-hold-delay-phase-sign",
    title: "Sample Hold Delay Phase Sign Tool",
    description:
      "Phase of a pure supplied delay under an explicit Fourier-sign convention; no hold transfer function approximation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularFrequency: { type: "number" },
        delay: { type: "number", minimum: 0 },
        convention: {
          type: "string",
          maxLength: 8192,
          enum: ["exp-positive", "exp-negative"],
        },
      },
      required: ["angularFrequency", "delay", "convention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseShift: { type: "number" } },
      required: ["phaseShift"],
    },
    ports: {
      inputs: [
        {
          id: "angularFrequency",
          label: "Angular Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delay",
          label: "Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "convention",
          label: "Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "phaseShift",
          label: "Phase Shift",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleHoldDelayPhaseSignTool.execute;
export default sampleHoldDelayPhaseSignTool;
