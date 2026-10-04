import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areas: readonly number[];
  readonly creditFactors: readonly number[];
  readonly lotArea: number;
};
export type Output = {
  readonly creditedArea: number;
  readonly creditedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areas: { type: "array", maxItems: 256, items: { type: "number" } },
    creditFactors: { type: "array", maxItems: 256, items: { type: "number" } },
    lotArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["areas", "creditFactors", "lotArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedArea: { type: "number" },
    creditedFraction: { type: "number" },
  },
  required: ["creditedArea", "creditedFraction"],
} as const;
/** Apply explicit independent area credit factors; no local regulation is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areas, creditFactors, lotArea } = request;
  const compute = (): Output => {
    H.sameLength(areas, creditFactors);
    H.domain(
      areas.every((x) => x >= 0) &&
        creditFactors.every((x) => x >= 0 && x <= 1),
    );
    H.positive(lotArea);
    return {
      creditedArea: H.dot(areas, creditFactors),
      creditedFraction: H.dot(areas, creditFactors) / lotArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { areas: [100, 50], creditFactors: [1, 0.5], lotArea: 500 },
  output: { creditedArea: 125, creditedFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const permeableSurfaceCreditExplicitFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "urban-planning/permeable-surface-credit-explicit-factor",
      title: "Permeable Surface Credit Explicit Factor Tool",
      description:
        "Apply explicit independent area credit factors; no local regulation is selected.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          areas: { type: "array", maxItems: 256, items: { type: "number" } },
          creditFactors: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          lotArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["areas", "creditFactors", "lotArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          creditedArea: { type: "number" },
          creditedFraction: { type: "number" },
        },
        required: ["creditedArea", "creditedFraction"],
      },
      ports: {
        inputs: [
          {
            id: "areas",
            label: "Areas",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "creditFactors",
            label: "Credit Factors",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "lotArea",
            label: "Lot Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "creditedArea",
            label: "Credited Area",
            valueType: { type: "number" },
          },
          {
            id: "creditedFraction",
            label: "Credited Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = permeableSurfaceCreditExplicitFactorTool.execute;
export default permeableSurfaceCreditExplicitFactorTool;
