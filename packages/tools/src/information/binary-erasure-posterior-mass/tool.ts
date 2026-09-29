import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorOne: number;
  readonly erased: boolean;
  readonly observedOne: boolean;
};
export type Output = { readonly posteriorOne: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorOne: { type: "number", minimum: 0, maximum: 1 },
    erased: { type: "boolean" },
    observedOne: { type: "boolean" },
  },
  required: ["priorOne", "erased", "observedOne"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { posteriorOne: { type: "number" } },
  required: ["posteriorOne"],
} as const;
/** Posterior for an independent symbol-erasure channel; an unerased observation is exact. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorOne, erased, observedOne } = request;
  const compute = (): Output => {
    H.probability(priorOne);
    return { posteriorOne: erased ? priorOne : observedOne ? 1 : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorOne: 0.3, erased: true, observedOne: false },
  output: { posteriorOne: 0.3 },
} satisfies ToolExample<Input, Output>;
export const binaryErasurePosteriorMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/binary-erasure-posterior-mass",
    title: "Binary Erasure Posterior Mass Tool",
    description:
      "Posterior for an independent symbol-erasure channel; an unerased observation is exact.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorOne: { type: "number", minimum: 0, maximum: 1 },
        erased: { type: "boolean" },
        observedOne: { type: "boolean" },
      },
      required: ["priorOne", "erased", "observedOne"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { posteriorOne: { type: "number" } },
      required: ["posteriorOne"],
    },
    ports: {
      inputs: [
        {
          id: "priorOne",
          label: "Prior One",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "erased",
          label: "Erased",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "observedOne",
          label: "Observed One",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "posteriorOne",
          label: "Posterior One",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = binaryErasurePosteriorMassTool.execute;
export default binaryErasurePosteriorMassTool;
