import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dampingRatio: number };
export type Output = {
  readonly logDecrement: number;
  readonly amplitudeRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dampingRatio: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["dampingRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logDecrement: { type: "number" },
    amplitudeRatio: { type: "number" },
  },
  required: ["logDecrement", "amplitudeRatio"],
} as const;
/** Calculate viscous damping log decrement pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dampingRatio } = request;
  const compute = (): Output => {
    H.domain(dampingRatio >= 0 && dampingRatio < 1);
    const logDecrement =
      (2 * Math.PI * dampingRatio) / Math.sqrt(1 - dampingRatio * dampingRatio);
    return { logDecrement, amplitudeRatio: Math.exp(-logDecrement) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dampingRatio: 0 },
  output: { logDecrement: 0, amplitudeRatio: 1 },
} satisfies ToolExample<Input, Output>;
export const viscousDampingLogDecrementPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/viscous-damping-log-decrement-pair",
    title: "Viscous Damping Log Decrement Pair Tool",
    description:
      "Calculate viscous damping log decrement pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dampingRatio: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["dampingRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logDecrement: { type: "number" },
        amplitudeRatio: { type: "number" },
      },
      required: ["logDecrement", "amplitudeRatio"],
    },
    ports: {
      inputs: [
        {
          id: "dampingRatio",
          label: "Damping Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "logDecrement",
          label: "Log Decrement",
          valueType: { type: "number" },
        },
        {
          id: "amplitudeRatio",
          label: "Amplitude Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = viscousDampingLogDecrementPairTool.execute;
export default viscousDampingLogDecrementPairTool;
