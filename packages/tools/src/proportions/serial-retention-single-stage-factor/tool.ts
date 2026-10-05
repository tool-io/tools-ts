import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lossFraction: number;
  readonly inputAmount: number;
};
export type Output = {
  readonly retainedFraction: number;
  readonly outputAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lossFraction: { type: "number", minimum: 0, maximum: 1 },
    inputAmount: { type: "number", minimum: 0 },
  },
  required: ["lossFraction", "inputAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedFraction: { type: "number" },
    outputAmount: { type: "number" },
  },
  required: ["retainedFraction", "outputAmount"],
} as const;
/** Apply one serial retention stage to a nonnegative amount from its stated loss fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lossFraction, inputAmount } = request;
  const compute = (): Output => {
    (H.domain(lossFraction >= 0 && lossFraction <= 1, "lossFraction"),
      lossFraction);
    H.domain(inputAmount >= 0, "inputAmount");
    return {
      retainedFraction: 1 - lossFraction,
      outputAmount: inputAmount * (1 - lossFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lossFraction: 0.25, inputAmount: 80 },
  output: { retainedFraction: 0.75, outputAmount: 60 },
} satisfies ToolExample<Input, Output>;
export const serialRetentionSingleStageFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/serial-retention-single-stage-factor",
    title: "Serial Retention Single Stage Factor Tool",
    description:
      "Apply one serial retention stage to a nonnegative amount from its stated loss fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lossFraction: { type: "number", minimum: 0, maximum: 1 },
        inputAmount: { type: "number", minimum: 0 },
      },
      required: ["lossFraction", "inputAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedFraction: { type: "number" },
        outputAmount: { type: "number" },
      },
      required: ["retainedFraction", "outputAmount"],
    },
    ports: {
      inputs: [
        {
          id: "lossFraction",
          label: "Loss Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputAmount",
          label: "Input Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          valueType: { type: "number" },
        },
        {
          id: "outputAmount",
          label: "Output Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = serialRetentionSingleStageFactorTool.execute;
export default serialRetentionSingleStageFactorTool;
