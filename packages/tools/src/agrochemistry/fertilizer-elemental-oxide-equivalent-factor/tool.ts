import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oxideMass: number;
  readonly suppliedElementFraction: number;
};
export type Output = { readonly elementMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oxideMass: { type: "number", minimum: 0 },
    suppliedElementFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["oxideMass", "suppliedElementFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elementMass: { type: "number" } },
  required: ["elementMass"],
} as const;
/** Convert a supplied oxide-equivalent mass using an explicitly supplied elemental fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oxideMass, suppliedElementFraction } = request;
  const compute = (): Output => {
    H.domain(oxideMass >= 0);
    H.probability(suppliedElementFraction);
    return { elementMass: oxideMass * suppliedElementFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oxideMass: 100, suppliedElementFraction: 0.4364 },
  output: { elementMass: 43.64 },
} satisfies ToolExample<Input, Output>;
export const fertilizerElementalOxideEquivalentFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/fertilizer-elemental-oxide-equivalent-factor",
      title: "Fertilizer Elemental Oxide Equivalent Factor Tool",
      description:
        "Convert a supplied oxide-equivalent mass using an explicitly supplied elemental fraction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oxideMass: { type: "number", minimum: 0 },
          suppliedElementFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["oxideMass", "suppliedElementFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { elementMass: { type: "number" } },
        required: ["elementMass"],
      },
      ports: {
        inputs: [
          {
            id: "oxideMass",
            label: "Oxide Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedElementFraction",
            label: "Supplied Element Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "elementMass",
            label: "Element Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fertilizerElementalOxideEquivalentFactorTool.execute;
export default fertilizerElementalOxideEquivalentFactorTool;
