import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outputBefore: number;
  readonly proportionalAfter: number;
  readonly integralAfter: number;
  readonly derivativeAfter: number;
  readonly feedforwardAfter: number;
};
export type Output = { readonly requiredBias: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputBefore: { type: "number" },
    proportionalAfter: { type: "number" },
    integralAfter: { type: "number" },
    derivativeAfter: { type: "number" },
    feedforwardAfter: { type: "number" },
  },
  required: [
    "outputBefore",
    "proportionalAfter",
    "integralAfter",
    "derivativeAfter",
    "feedforwardAfter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredBias: { type: "number" } },
  required: ["requiredBias"],
} as const;
/** Algebraic bias for a caller-established bumpless controller reset; does not tune or operate a controller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    outputBefore,
    proportionalAfter,
    integralAfter,
    derivativeAfter,
    feedforwardAfter,
  } = request;
  const compute = (): Output => {
    return {
      requiredBias:
        outputBefore -
        proportionalAfter -
        integralAfter -
        derivativeAfter -
        feedforwardAfter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outputBefore: 10,
    proportionalAfter: 3,
    integralAfter: 2,
    derivativeAfter: 1,
    feedforwardAfter: 1,
  },
  output: { requiredBias: 3 },
} satisfies ToolExample<Input, Output>;
export const controllerResetBiasGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/controller-reset-bias-gap",
    title: "Controller Reset Bias Gap Tool",
    description:
      "Algebraic bias for a caller-established bumpless controller reset; does not tune or operate a controller.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outputBefore: { type: "number" },
        proportionalAfter: { type: "number" },
        integralAfter: { type: "number" },
        derivativeAfter: { type: "number" },
        feedforwardAfter: { type: "number" },
      },
      required: [
        "outputBefore",
        "proportionalAfter",
        "integralAfter",
        "derivativeAfter",
        "feedforwardAfter",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { requiredBias: { type: "number" } },
      required: ["requiredBias"],
    },
    ports: {
      inputs: [
        {
          id: "outputBefore",
          label: "Output Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proportionalAfter",
          label: "Proportional After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "integralAfter",
          label: "Integral After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "derivativeAfter",
          label: "Derivative After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feedforwardAfter",
          label: "Feedforward After",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredBias",
          label: "Required Bias",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = controllerResetBiasGapTool.execute;
export default controllerResetBiasGapTool;
