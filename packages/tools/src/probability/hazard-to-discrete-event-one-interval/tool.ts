import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly hazard: number; readonly duration: number };
export type Output = { readonly probability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hazard: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
  },
  required: ["hazard", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { probability: { type: "number" } },
  required: ["probability"],
} as const;
/** Calculate hazard to discrete event one interval from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { hazard, duration } = input;
  const compute = (): Output => {
    H.domain(hazard >= 0 && duration >= 0);
    return { probability: -Math.expm1(-hazard * duration) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { hazard: 0.6931471805599453, duration: 1 },
  output: { probability: 0.5 },
} satisfies ToolExample<Input, Output>;
export const hazardToDiscreteEventOneIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/hazard-to-discrete-event-one-interval",
    title: "Hazard To Discrete Event One Interval Tool",
    description:
      "Calculate hazard to discrete event one interval from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hazard: { type: "number", minimum: 0 },
        duration: { type: "number", minimum: 0 },
      },
      required: ["hazard", "duration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { probability: { type: "number" } },
      required: ["probability"],
    },
    ports: {
      inputs: [
        {
          id: "hazard",
          label: "Hazard",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "probability",
          label: "Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hazardToDiscreteEventOneIntervalTool.execute;
export default hazardToDiscreteEventOneIntervalTool;
