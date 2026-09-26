import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly alpha: number;
};
export type Output = { readonly mrs: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number", exclusiveMinimum: 0 },
    y: { type: "number", exclusiveMinimum: 0 },
    alpha: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
  },
  required: ["x", "y", "alpha"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mrs: { type: "number" } },
  required: ["mrs"],
} as const;
/** Return MU_x/MU_y for x^alpha*y^(1-alpha), with positive quantities and an interior exponent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, alpha } = request;
  const compute = (): Output => {
    H.positive(x);
    H.positive(y);
    H.domain(alpha > 0 && alpha < 1);
    return { mrs: (alpha * y) / ((1 - alpha) * x) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 4, y: 6, alpha: 0.5 },
  output: { mrs: 1.5 },
} satisfies ToolExample<Input, Output>;
export const cobbDouglasMarginalRateSubstitutionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economics/cobb-douglas-marginal-rate-substitution-term",
      title: "Cobb Douglas Marginal Rate Substitution Term Tool",
      description:
        "Return MU_x/MU_y for x^alpha*y^(1-alpha), with positive quantities and an interior exponent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number", exclusiveMinimum: 0 },
          y: { type: "number", exclusiveMinimum: 0 },
          alpha: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
        },
        required: ["x", "y", "alpha"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { mrs: { type: "number" } },
        required: ["mrs"],
      },
      ports: {
        inputs: [
          {
            id: "x",
            label: "X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "y",
            label: "Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "alpha",
            label: "Alpha",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [{ id: "mrs", label: "Mrs", valueType: { type: "number" } }],
      },
    },
    calculate,
  });
export const run = cobbDouglasMarginalRateSubstitutionTermTool.execute;
export default cobbDouglasMarginalRateSubstitutionTermTool;
