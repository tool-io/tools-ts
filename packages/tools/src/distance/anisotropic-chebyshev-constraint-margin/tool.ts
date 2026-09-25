import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly differences: readonly number[];
  readonly tolerances: readonly number[];
};
export type Output = {
  readonly scaledDistance: number;
  readonly margin: number;
  readonly within: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    differences: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerances: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["differences", "tolerances"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaledDistance: { type: "number" },
    margin: { type: "number" },
    within: { type: "boolean" },
  },
  required: ["scaledDistance", "margin", "within"],
} as const;
/** Compute anisotropic chebyshev constraint margin from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { differences, tolerances } = input;
  const compute = (): Output => {
    sameLength(differences, tolerances);
    domain(differences.length > 0 && tolerances.every((x) => x > 0));
    const scaledDistance = Math.max(
      ...differences.map((x, i) => Math.abs(x) / tolerances[i]),
    );
    return {
      scaledDistance,
      margin: 1 - scaledDistance,
      within: scaledDistance <= 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { differences: [2, 3], tolerances: [4, 4] },
  output: { scaledDistance: 0.75, margin: 0.25, within: true },
} satisfies ToolExample<Input, Output>;
export const anisotropicChebyshevConstraintMarginTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "distance/anisotropic-chebyshev-constraint-margin",
  title: "Anisotropic Chebyshev Constraint Margin Tool",
  description:
    "Compute anisotropic chebyshev constraint margin from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "differences",
        label: "Differences",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "tolerances",
        label: "Tolerances",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
    outputs: [
      {
        id: "scaledDistance",
        label: "Scaled Distance",
        valueType: { type: "number" },
      },
      { id: "margin", label: "Margin", valueType: { type: "number" } },
      { id: "within", label: "Within", valueType: { type: "boolean" } },
    ],
  },
});
export const run = anisotropicChebyshevConstraintMarginTool.execute;
export default anisotropicChebyshevConstraintMarginTool;
