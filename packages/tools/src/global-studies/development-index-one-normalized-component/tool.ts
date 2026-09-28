import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly logarithmic: boolean;
};
export type Output = { readonly normalized: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    minimum: { type: "number" },
    maximum: { type: "number" },
    logarithmic: { type: "boolean" },
  },
  required: ["value", "minimum", "maximum", "logarithmic"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "number" } },
  required: ["normalized"],
} as const;
/** One linear or logarithmic index component with explicit reference bounds; out-of-range values are retained and no named development index is asserted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, minimum, maximum, logarithmic } = request;
  const compute = (): Output => {
    H.domain(maximum > minimum && (!logarithmic || (minimum > 0 && value > 0)));
    return {
      normalized: logarithmic
        ? Math.log(value / minimum) / Math.log(maximum / minimum)
        : (value - minimum) / (maximum - minimum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 50, minimum: 20, maximum: 80, logarithmic: false },
  output: { normalized: 0.5 },
} satisfies ToolExample<Input, Output>;
export const developmentIndexOneNormalizedComponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/development-index-one-normalized-component",
      title: "Development Index One Normalized Component Tool",
      description:
        "One linear or logarithmic index component with explicit reference bounds; out-of-range values are retained and no named development index is asserted.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          minimum: { type: "number" },
          maximum: { type: "number" },
          logarithmic: { type: "boolean" },
        },
        required: ["value", "minimum", "maximum", "logarithmic"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { normalized: { type: "number" } },
        required: ["normalized"],
      },
      ports: {
        inputs: [
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimum",
            label: "Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximum",
            label: "Maximum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "logarithmic",
            label: "Logarithmic",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentIndexOneNormalizedComponentTool.execute;
export default developmentIndexOneNormalizedComponentTool;
