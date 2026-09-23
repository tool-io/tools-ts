import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spiked: number;
  readonly unspiked: number;
  readonly spikeAdded: number;
};
export type Output = { readonly recoveryFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spiked: { type: "number" },
    unspiked: { type: "number" },
    spikeAdded: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spiked", "unspiked", "spikeAdded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recoveryFraction: { type: "number" } },
  required: ["recoveryFraction"],
} as const;
/** Subtract the matched unspiked signal before dividing by the known added spike; recovery can exceed one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spiked, unspiked, spikeAdded } = request;
  const compute = (): Output => {
    H.positive(spikeAdded);
    return { recoveryFraction: (spiked - unspiked) / spikeAdded };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spiked: 15, unspiked: 5, spikeAdded: 8 },
  output: { recoveryFraction: 1.25 },
} satisfies ToolExample<Input, Output>;
export const assaySpikeRecoveryBackgroundTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/assay-spike-recovery-background-term",
    title: "Assay Spike Recovery Background Term Tool",
    description:
      "Subtract the matched unspiked signal before dividing by the known added spike; recovery can exceed one.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spiked: { type: "number" },
        unspiked: { type: "number" },
        spikeAdded: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spiked", "unspiked", "spikeAdded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recoveryFraction: { type: "number" } },
      required: ["recoveryFraction"],
    },
    ports: {
      inputs: [
        {
          id: "spiked",
          label: "Spiked",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unspiked",
          label: "Unspiked",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spikeAdded",
          label: "Spike Added",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assaySpikeRecoveryBackgroundTermTool.execute;
export default assaySpikeRecoveryBackgroundTermTool;
