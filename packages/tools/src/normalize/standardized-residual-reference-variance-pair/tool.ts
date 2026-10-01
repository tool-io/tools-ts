import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly residual: number; readonly variance: number };
export type Output = {
  readonly standardized: number;
  readonly squared: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    variance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["residual", "variance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standardized: { type: "number" }, squared: { type: "number" } },
  required: ["standardized", "squared"],
} as const;
/** Calculate standardized residual reference variance pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { residual, variance } = input;
  const compute = (): Output => {
    H.positive(variance);
    const standardized = residual / Math.sqrt(variance);
    return { standardized, squared: standardized * standardized };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { residual: -6, variance: 9 },
  output: { standardized: -2, squared: 4 },
} satisfies ToolExample<Input, Output>;
export const standardizedResidualReferenceVariancePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "normalize/standardized-residual-reference-variance-pair",
      title: "Standardized Residual Reference Variance Pair Tool",
      description:
        "Calculate standardized residual reference variance pair from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residual: { type: "number" },
          variance: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["residual", "variance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standardized: { type: "number" },
          squared: { type: "number" },
        },
        required: ["standardized", "squared"],
      },
      ports: {
        inputs: [
          {
            id: "residual",
            label: "Residual",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "variance",
            label: "Variance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "standardized",
            label: "Standardized",
            valueType: { type: "number" },
          },
          { id: "squared", label: "Squared", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = standardizedResidualReferenceVariancePairTool.execute;
export default standardizedResidualReferenceVariancePairTool;
