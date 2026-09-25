import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly state: number;
  readonly reference: number;
  readonly coefficient: number;
};
export type Output = { readonly next: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    state: { type: "number" },
    reference: { type: "number" },
    coefficient: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["state", "reference", "coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { next: { type: "number" } },
  required: ["next"],
} as const;
/** Calculate reference prefilter one state update from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { state, reference, coefficient } = request;
  const compute = (): Output => {
    H.probability(coefficient);
    return { next: state + coefficient * (reference - state) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { state: 2, reference: 10, coefficient: 0.25 },
  output: { next: 4 },
} satisfies ToolExample<Input, Output>;
export const referencePrefilterOneStateUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/reference-prefilter-one-state-update",
    title: "Reference Prefilter One State Update Tool",
    description:
      "Calculate reference prefilter one state update from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        state: { type: "number" },
        reference: { type: "number" },
        coefficient: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["state", "reference", "coefficient"],
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
          id: "state",
          label: "State",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "next", label: "Next", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = referencePrefilterOneStateUpdateTool.execute;
export default referencePrefilterOneStateUpdateTool;
