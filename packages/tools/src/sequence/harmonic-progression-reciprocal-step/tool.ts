import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly current: number;
  readonly reciprocalDifference: number;
};
export type Output = { readonly next: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "number" },
    reciprocalDifference: { type: "number" },
  },
  required: ["current", "reciprocalDifference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { next: { type: "number" } },
  required: ["next"],
} as const;
/** Calculate harmonic progression reciprocal step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { current, reciprocalDifference } = request;
  const compute = (): Output => {
    H.domain(current !== 0 && 1 / current + reciprocalDifference !== 0);
    return { next: 1 / (1 / current + reciprocalDifference) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { current: 0.5, reciprocalDifference: 1 },
  output: { next: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const harmonicProgressionReciprocalStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/harmonic-progression-reciprocal-step",
    title: "Harmonic Progression Reciprocal Step Tool",
    description:
      "Calculate harmonic progression reciprocal step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        current: { type: "number" },
        reciprocalDifference: { type: "number" },
      },
      required: ["current", "reciprocalDifference"],
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
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reciprocalDifference",
          label: "Reciprocal Difference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "next", label: "Next", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = harmonicProgressionReciprocalStepTool.execute;
export default harmonicProgressionReciprocalStepTool;
