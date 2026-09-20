import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly suppliedZeroSlope: number };
export type Output = {
  readonly slope: number;
  readonly atNondifferentiablePoint: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    suppliedZeroSlope: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["x", "suppliedZeroSlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slope: { type: "number" },
    atNondifferentiablePoint: { type: "boolean" },
  },
  required: ["slope", "atNondifferentiablePoint"],
} as const;
/** Return a ReLU slope away from zero and a caller-selected convex subgradient at zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, suppliedZeroSlope } = request;
  const compute = (): Output => {
    H.probability(suppliedZeroSlope);
    return {
      slope: x > 0 ? 1 : x < 0 ? 0 : suppliedZeroSlope,
      atNondifferentiablePoint: x === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 0, suppliedZeroSlope: 0.25 },
  output: { slope: 0.25, atNondifferentiablePoint: true },
} satisfies ToolExample<Input, Output>;
export const reluZeroSubgradientChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/relu-zero-subgradient-choice",
    title: "ReLU Zero Subgradient Choice Tool",
    description:
      "Return a ReLU slope away from zero and a caller-selected convex subgradient at zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        suppliedZeroSlope: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["x", "suppliedZeroSlope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slope: { type: "number" },
        atNondifferentiablePoint: { type: "boolean" },
      },
      required: ["slope", "atNondifferentiablePoint"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "suppliedZeroSlope",
          label: "Supplied Zero Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slope", label: "Slope", valueType: { type: "number" } },
        {
          id: "atNondifferentiablePoint",
          label: "At Nondifferentiable Point",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = reluZeroSubgradientChoiceTool.execute;
export default reluZeroSubgradientChoiceTool;
