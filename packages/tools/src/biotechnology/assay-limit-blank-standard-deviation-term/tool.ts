import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blankMean: number;
  readonly blankDeviation: number;
  readonly coefficient: number;
};
export type Output = { readonly limit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankMean: { type: "number" },
    blankDeviation: { type: "number", minimum: 0 },
    coefficient: { type: "number", minimum: 0 },
  },
  required: ["blankMean", "blankDeviation", "coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { limit: { type: "number" } },
  required: ["limit"],
} as const;
/** Evaluate a caller-specified mean-plus-deviation blank-limit model without selecting a clinical or regulatory coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blankMean, blankDeviation, coefficient } = request;
  const compute = (): Output => {
    H.domain(blankDeviation >= 0 && coefficient >= 0);
    return { limit: blankMean + coefficient * blankDeviation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { blankMean: 2, blankDeviation: 0.5, coefficient: 2 },
  output: { limit: 3 },
} satisfies ToolExample<Input, Output>;
export const assayLimitBlankStandardDeviationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/assay-limit-blank-standard-deviation-term",
      title: "Assay Limit Blank Standard Deviation Term Tool",
      description:
        "Evaluate a caller-specified mean-plus-deviation blank-limit model without selecting a clinical or regulatory coefficient.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          blankMean: { type: "number" },
          blankDeviation: { type: "number", minimum: 0 },
          coefficient: { type: "number", minimum: 0 },
        },
        required: ["blankMean", "blankDeviation", "coefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { limit: { type: "number" } },
        required: ["limit"],
      },
      ports: {
        inputs: [
          {
            id: "blankMean",
            label: "Blank Mean",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blankDeviation",
            label: "Blank Deviation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coefficient",
            label: "Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "limit", label: "Limit", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = assayLimitBlankStandardDeviationTermTool.execute;
export default assayLimitBlankStandardDeviationTermTool;
