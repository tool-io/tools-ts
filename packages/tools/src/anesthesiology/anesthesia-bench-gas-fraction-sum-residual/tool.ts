import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fractions: readonly number[];
  readonly expectedTotal: number;
  readonly tolerance: number;
};
export type Output = {
  readonly total: number;
  readonly residual: number;
  readonly within: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractions: { type: "array", maxItems: 256, items: { type: "number" } },
    expectedTotal: { type: "number", minimum: 0, maximum: 1 },
    tolerance: { type: "number" },
  },
  required: ["fractions", "expectedTotal", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "number" },
    residual: { type: "number" },
    within: { type: "boolean" },
  },
  required: ["total", "residual", "within"],
} as const;
/** Audit supplied bench gas fractions against an explicit total and tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fractions, expectedTotal, tolerance } = request;
  const compute = (): Output => {
    H.domain(
      fractions.every((x) => x >= 0 && x <= 1) &&
        expectedTotal >= 0 &&
        expectedTotal <= 1 &&
        tolerance >= 0,
      "fractions",
    );
    return {
      total: fractions.reduce((a, b) => a + b, 0),
      residual: fractions.reduce((a, b) => a + b, 0) - expectedTotal,
      within:
        Math.abs(fractions.reduce((a, b) => a + b, 0) - expectedTotal) <=
        tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fractions: [0.2, 0.3, 0.4], expectedTotal: 1, tolerance: 0.05 },
  output: { total: 0.9, residual: -0.09999999999999998, within: false },
} satisfies ToolExample<Input, Output>;
export const anesthesiaBenchGasFractionSumResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anesthesiology/anesthesia-bench-gas-fraction-sum-residual",
      title: "Anesthesia Bench Gas Fraction Sum Residual Tool",
      description:
        "Audit supplied bench gas fractions against an explicit total and tolerance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fractions: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          expectedTotal: { type: "number", minimum: 0, maximum: 1 },
          tolerance: { type: "number" },
        },
        required: ["fractions", "expectedTotal", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          total: { type: "number" },
          residual: { type: "number" },
          within: { type: "boolean" },
        },
        required: ["total", "residual", "within"],
      },
      ports: {
        inputs: [
          {
            id: "fractions",
            label: "Fractions",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "expectedTotal",
            label: "Expected Total",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tolerance",
            label: "Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "total", label: "Total", valueType: { type: "number" } },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          { id: "within", label: "Within", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = anesthesiaBenchGasFractionSumResidualTool.execute;
export default anesthesiaBenchGasFractionSumResidualTool;
