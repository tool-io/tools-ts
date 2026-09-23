import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly unanchoredAtReference: number;
  readonly referenceValue: number;
  readonly unanchoredAtTarget: number;
};
export type Output = {
  readonly constant: number;
  readonly targetValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unanchoredAtReference: { type: "number" },
    referenceValue: { type: "number" },
    unanchoredAtTarget: { type: "number" },
  },
  required: ["unanchoredAtReference", "referenceValue", "unanchoredAtTarget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { constant: { type: "number" }, targetValue: { type: "number" } },
  required: ["constant", "targetValue"],
} as const;
/** Compute antiderivative additive constant anchor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { unanchoredAtReference, referenceValue, unanchoredAtTarget } = input;
  const compute = (): Output => {
    const constant = referenceValue - unanchoredAtReference;
    return { constant, targetValue: unanchoredAtTarget + constant };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { unanchoredAtReference: 3, referenceValue: 5, unanchoredAtTarget: 8 },
  output: { constant: 2, targetValue: 10 },
} satisfies ToolExample<Input, Output>;
export const antiderivativeAdditiveConstantAnchorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/antiderivative-additive-constant-anchor",
  title: "Antiderivative Additive Constant Anchor Tool",
  description:
    "Compute antiderivative additive constant anchor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "unanchoredAtReference",
        label: "Unanchored At Reference",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "referenceValue",
        label: "Reference Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "unanchoredAtTarget",
        label: "Unanchored At Target",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "constant", label: "Constant", valueType: { type: "number" } },
      {
        id: "targetValue",
        label: "Target Value",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = antiderivativeAdditiveConstantAnchorTool.execute;
export default antiderivativeAdditiveConstantAnchorTool;
