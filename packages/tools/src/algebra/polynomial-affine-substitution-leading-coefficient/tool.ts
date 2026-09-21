import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly leading: number;
  readonly degree: number;
  readonly scale: number;
};
export type Output = { readonly leading: number; readonly degree: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leading: { type: "number" },
    degree: { type: "integer", minimum: 0, maximum: 128 },
    scale: { type: "number" },
  },
  required: ["leading", "degree", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leading: { type: "number" }, degree: { type: "integer" } },
  required: ["leading", "degree"],
} as const;
/** Compute polynomial affine substitution leading coefficient from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leading, degree, scale } = input;
  const compute = (): Output => {
    integer(degree, 0, 128);
    domain(leading !== 0 && scale !== 0);
    return { leading: leading * scale ** degree, degree };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leading: 3, degree: 2, scale: 2 },
  output: { leading: 12, degree: 2 },
} satisfies ToolExample<Input, Output>;
export const polynomialAffineSubstitutionLeadingCoefficientTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/polynomial-affine-substitution-leading-coefficient",
    title: "Polynomial Affine Substitution Leading Coefficient Tool",
    description:
      "Compute polynomial affine substitution leading coefficient from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "leading",
          label: "Leading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "degree",
          label: "Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "leading", label: "Leading", valueType: { type: "number" } },
        { id: "degree", label: "Degree", valueType: { type: "integer" } },
      ],
    },
  });
export const run = polynomialAffineSubstitutionLeadingCoefficientTool.execute;
export default polynomialAffineSubstitutionLeadingCoefficientTool;
