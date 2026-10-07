import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly primeOnset: number;
  readonly targetOnset: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primeOnset: { type: "number" },
    targetOnset: { type: "number" },
  },
  required: ["primeOnset", "targetOnset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed supplied target-minus-prime onset asynchrony in a shared monotonic time unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { primeOnset, targetOnset } = request;
  const compute = (): Output => {
    return { signedGap: targetOnset - primeOnset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { primeOnset: 12, targetOnset: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const primingTargetOnsetAsynchronyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/priming-target-onset-asynchrony",
    title: "Priming Target Onset Asynchrony",
    description:
      "Calculate signed supplied target-minus-prime onset asynchrony in a shared monotonic time unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        primeOnset: { type: "number" },
        targetOnset: { type: "number" },
      },
      required: ["primeOnset", "targetOnset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "primeOnset",
          label: "Prime Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetOnset",
          label: "Target Onset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = primingTargetOnsetAsynchronyTool.execute;
export default primingTargetOnsetAsynchronyTool;
