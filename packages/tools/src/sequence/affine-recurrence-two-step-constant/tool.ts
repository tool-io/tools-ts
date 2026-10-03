import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly multiplier: number; readonly offset: number };
export type Output = {
  readonly twoStepMultiplier: number;
  readonly twoStepOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { multiplier: { type: "number" }, offset: { type: "number" } },
  required: ["multiplier", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    twoStepMultiplier: { type: "number" },
    twoStepOffset: { type: "number" },
  },
  required: ["twoStepMultiplier", "twoStepOffset"],
} as const;
/** Compose x↦a*x+b with itself and return its affine coefficients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { multiplier, offset } = request;
  const compute = (): Output => {
    return {
      twoStepMultiplier: multiplier ** 2,
      twoStepOffset: offset * (multiplier + 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { multiplier: 2, offset: 3 },
  output: { twoStepMultiplier: 4, twoStepOffset: 9 },
} satisfies ToolExample<Input, Output>;
export const affineRecurrenceTwoStepConstantTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/affine-recurrence-two-step-constant",
    title: "Affine Recurrence Two Step Constant Tool",
    description:
      "Compose x↦a*x+b with itself and return its affine coefficients.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multiplier: { type: "number" },
        offset: { type: "number" },
      },
      required: ["multiplier", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        twoStepMultiplier: { type: "number" },
        twoStepOffset: { type: "number" },
      },
      required: ["twoStepMultiplier", "twoStepOffset"],
    },
    ports: {
      inputs: [
        {
          id: "multiplier",
          label: "Multiplier",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "twoStepMultiplier",
          label: "Two Step Multiplier",
          valueType: { type: "number" },
        },
        {
          id: "twoStepOffset",
          label: "Two Step Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = affineRecurrenceTwoStepConstantTool.execute;
export default affineRecurrenceTwoStepConstantTool;
