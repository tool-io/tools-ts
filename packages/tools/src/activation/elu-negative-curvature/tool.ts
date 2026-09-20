import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly alpha: number };
export type Output = { readonly curvature: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, alpha: { type: "number", minimum: 0 } },
  required: ["x", "alpha"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { curvature: { type: "number" } },
  required: ["curvature"],
} as const;
/** Evaluate ELU second derivative on the negative branch and zero on the positive branch; at zero use the positive-side value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, alpha } = request;
  const compute = (): Output => {
    H.domain(alpha >= 0);
    return { curvature: x < 0 ? alpha * Math.exp(x) : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: -1, alpha: 2 },
  output: { curvature: 0.7357588823428847 },
} satisfies ToolExample<Input, Output>;
export const eluNegativeCurvatureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/elu-negative-curvature",
    title: "ELU Negative Curvature Tool",
    description:
      "Evaluate ELU second derivative on the negative branch and zero on the positive branch; at zero use the positive-side value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        alpha: { type: "number", minimum: 0 },
      },
      required: ["x", "alpha"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { curvature: { type: "number" } },
      required: ["curvature"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "curvature", label: "Curvature", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eluNegativeCurvatureTool.execute;
export default eluNegativeCurvatureTool;
