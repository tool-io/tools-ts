import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly slope: number };
export type Output = { readonly denominator: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slope: { type: "number" } },
  required: ["slope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "number" } },
  required: ["denominator"],
} as const;
/** Return the planar graph-curvature denominator (1+slope²)^(3/2), using a hypot norm before cubing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slope } = request;
  const compute = (): Output => {
    return { denominator: Math.hypot(1, slope) ** 3 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slope: 0 },
  output: { denominator: 1 },
} satisfies ToolExample<Input, Output>;
export const curvatureNormalizationDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/curvature-normalization-denominator",
    title: "Curvature Normalization Denominator Tool",
    description:
      "Return the planar graph-curvature denominator (1+slope²)^(3/2), using a hypot norm before cubing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slope: { type: "number" } },
      required: ["slope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { denominator: { type: "number" } },
      required: ["denominator"],
    },
    ports: {
      inputs: [
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = curvatureNormalizationDenominatorTool.execute;
export default curvatureNormalizationDenominatorTool;
