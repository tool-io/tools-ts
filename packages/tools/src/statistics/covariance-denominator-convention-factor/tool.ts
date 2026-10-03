import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly covariance: number;
  readonly count: number;
  readonly fromSample: boolean;
};
export type Output = { readonly covariance: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    covariance: { type: "number" },
    count: { type: "integer", minimum: 2 },
    fromSample: { type: "boolean" },
  },
  required: ["covariance", "count", "fromSample"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { covariance: { type: "number" }, factor: { type: "number" } },
  required: ["covariance", "factor"],
} as const;
/** Calculate covariance denominator convention factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { covariance, count, fromSample } = request;
  const compute = (): Output => {
    H.integer(count, 2);
    const factor = fromSample ? (count - 1) / count : count / (count - 1);
    return { covariance: covariance * factor, factor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { covariance: 4, count: 5, fromSample: true },
  output: { covariance: 3.2, factor: 0.8 },
} satisfies ToolExample<Input, Output>;
export const covarianceDenominatorConventionFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/covariance-denominator-convention-factor",
      title: "Covariance Denominator Convention Factor Tool",
      description:
        "Calculate covariance denominator convention factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          covariance: { type: "number" },
          count: { type: "integer", minimum: 2 },
          fromSample: { type: "boolean" },
        },
        required: ["covariance", "count", "fromSample"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          covariance: { type: "number" },
          factor: { type: "number" },
        },
        required: ["covariance", "factor"],
      },
      ports: {
        inputs: [
          {
            id: "covariance",
            label: "Covariance",
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
            id: "fromSample",
            label: "From Sample",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "covariance",
            label: "Covariance",
            valueType: { type: "number" },
          },
          { id: "factor", label: "Factor", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = covarianceDenominatorConventionFactorTool.execute;
export default covarianceDenominatorConventionFactorTool;
