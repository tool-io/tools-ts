import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sumSquares: number;
  readonly count: number;
  readonly missing: number;
  readonly sample: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly defined: boolean;
  readonly variance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sumSquares: { type: "number", minimum: 0 },
    count: { type: "integer", minimum: 0 },
    missing: { type: "integer", minimum: 0 },
    sample: { type: "boolean" },
  },
  required: ["sumSquares", "count", "missing", "sample"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    defined: { type: "boolean" },
    variance: { type: "number" },
  },
  required: ["denominator", "defined", "variance"],
} as const;
/** Calculate row standardization one missing denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sumSquares, count, missing, sample } = request;
  const compute = (): Output => {
    H.domain(sumSquares >= 0);
    H.integer(count, 0);
    H.integer(missing, 0, count);
    const denominator = count - missing - (sample ? 1 : 0),
      defined = denominator > 0;
    return {
      denominator,
      defined,
      variance: defined ? sumSquares / denominator : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sumSquares: 12, count: 5, missing: 1, sample: true },
  output: { denominator: 3, defined: true, variance: 4 },
} satisfies ToolExample<Input, Output>;
export const rowStandardizationOneMissingDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "normalize/row-standardization-one-missing-denominator",
      title: "Row Standardization One Missing Denominator Tool",
      description:
        "Calculate row standardization one missing denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sumSquares: { type: "number", minimum: 0 },
          count: { type: "integer", minimum: 0 },
          missing: { type: "integer", minimum: 0 },
          sample: { type: "boolean" },
        },
        required: ["sumSquares", "count", "missing", "sample"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          defined: { type: "boolean" },
          variance: { type: "number" },
        },
        required: ["denominator", "defined", "variance"],
      },
      ports: {
        inputs: [
          {
            id: "sumSquares",
            label: "Sum Squares",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "count",
            label: "Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missing",
            label: "Missing",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sample",
            label: "Sample",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
          { id: "variance", label: "Variance", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = rowStandardizationOneMissingDenominatorTool.execute;
export default rowStandardizationOneMissingDenominatorTool;
