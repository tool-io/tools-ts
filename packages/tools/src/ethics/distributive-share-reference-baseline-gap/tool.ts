import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocation: number;
  readonly total: number;
  readonly referenceFraction: number;
};
export type Output = { readonly actualFraction: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocation: { type: "number", minimum: 0 },
    total: { type: "number", exclusiveMinimum: 0 },
    referenceFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["allocation", "total", "referenceFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { actualFraction: { type: "number" }, gap: { type: "number" } },
  required: ["actualFraction", "gap"],
} as const;
/** Calculate distributive share reference baseline gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocation, total, referenceFraction } = request;
  const compute = (): Output => {
    H.positive(total);
    H.domain(allocation >= 0 && allocation <= total);
    H.probability(referenceFraction);
    return {
      actualFraction: allocation / total,
      gap: allocation / total - referenceFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocation: 30, total: 100, referenceFraction: 0.25 },
  output: { actualFraction: 0.3, gap: 0.04999999999999999 },
} satisfies ToolExample<Input, Output>;
export const distributiveShareReferenceBaselineGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethics/distributive-share-reference-baseline-gap",
      title: "Distributive Share Reference Baseline Gap Tool",
      description:
        "Calculate distributive share reference baseline gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allocation: { type: "number", minimum: 0 },
          total: { type: "number", exclusiveMinimum: 0 },
          referenceFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["allocation", "total", "referenceFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          actualFraction: { type: "number" },
          gap: { type: "number" },
        },
        required: ["actualFraction", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "allocation",
            label: "Allocation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "total",
            label: "Total",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceFraction",
            label: "Reference Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "actualFraction",
            label: "Actual Fraction",
            valueType: { type: "number" },
          },
          { id: "gap", label: "Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = distributiveShareReferenceBaselineGapTool.execute;
export default distributiveShareReferenceBaselineGapTool;
