import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencies: readonly number[];
  readonly expectedSum: number;
  readonly tolerance: number;
};
export type Output = {
  readonly sum: number;
  readonly residual: number;
  readonly within: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencies: { type: "array", maxItems: 256, items: { type: "number" } },
    expectedSum: { type: "number", minimum: 0, maximum: 1 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["frequencies", "expectedSum", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sum: { type: "number" },
    residual: { type: "number" },
    within: { type: "boolean" },
  },
  required: ["sum", "residual", "within"],
} as const;
/** Calculate pharmacogene allele frequency sum residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencies, expectedSum, tolerance } = request;
  const compute = (): Output => {
    H.domain(
      frequencies.every((x) => x >= 0 && x <= 1) &&
        expectedSum >= 0 &&
        expectedSum <= 1 &&
        tolerance >= 0,
    );
    return {
      sum: frequencies.reduce((a, b) => a + b, 0),
      residual: frequencies.reduce((a, b) => a + b, 0) - expectedSum,
      within:
        Math.abs(frequencies.reduce((a, b) => a + b, 0) - expectedSum) <=
        tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequencies: [0.2, 0.3, 0.4], expectedSum: 1, tolerance: 0.05 },
  output: { sum: 0.9, residual: -0.09999999999999998, within: false },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneAlleleFrequencySumResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogene-allele-frequency-sum-residual",
      title: "Pharmacogene Allele Frequency Sum Residual Tool",
      description:
        "Calculate pharmacogene allele frequency sum residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          frequencies: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          expectedSum: { type: "number", minimum: 0, maximum: 1 },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["frequencies", "expectedSum", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sum: { type: "number" },
          residual: { type: "number" },
          within: { type: "boolean" },
        },
        required: ["sum", "residual", "within"],
      },
      ports: {
        inputs: [
          {
            id: "frequencies",
            label: "Frequencies",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "expectedSum",
            label: "Expected Sum",
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
          { id: "sum", label: "Sum", valueType: { type: "number" } },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          { id: "within", label: "Within", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogeneAlleleFrequencySumResidualTool.execute;
export default pharmacogeneAlleleFrequencySumResidualTool;
