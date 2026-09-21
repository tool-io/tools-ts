import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coefficient: number };
export type Output = {
  readonly denominator: number;
  readonly degenerate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coefficient: { type: "number" } },
  required: ["coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    degenerate: { type: "boolean" },
  },
  required: ["denominator", "degenerate"],
} as const;
/** Return only the unique-fixed-point denominator of x↦a*x+b and its degenerate coefficient flag; no affine system is solved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficient } = request;
  const compute = (): Output => {
    return { denominator: 1 - coefficient, degenerate: coefficient === 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coefficient: 0.8 },
  output: { denominator: 0.19999999999999996, degenerate: false },
} satisfies ToolExample<Input, Output>;
export const affineFixedPointDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/affine-fixed-point-denominator",
    title: "Affine Fixed Point Denominator Tool",
    description:
      "Return only the unique-fixed-point denominator of x↦a*x+b and its degenerate coefficient flag; no affine system is solved.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coefficient: { type: "number" } },
      required: ["coefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        degenerate: { type: "boolean" },
      },
      required: ["denominator", "degenerate"],
    },
    ports: {
      inputs: [
        {
          id: "coefficient",
          label: "Coefficient",
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
        {
          id: "degenerate",
          label: "Degenerate",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = affineFixedPointDenominatorTool.execute;
export default affineFixedPointDenominatorTool;
