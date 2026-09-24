import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regulator: number;
  readonly threshold: number;
  readonly coefficient: number;
  readonly basal: number;
  readonly maximal: number;
};
export type Output = {
  readonly repressionFraction: number;
  readonly productionRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regulator: { type: "number", minimum: 0 },
    threshold: { type: "number", exclusiveMinimum: 0 },
    coefficient: { type: "number", exclusiveMinimum: 0 },
    basal: { type: "number", minimum: 0 },
    maximal: { type: "number", minimum: 0 },
  },
  required: ["regulator", "threshold", "coefficient", "basal", "maximal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repressionFraction: { type: "number" },
    productionRate: { type: "number" },
  },
  required: ["repressionFraction", "productionRate"],
} as const;
/** Calculate hill repression one state evaluation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regulator, threshold, coefficient, basal, maximal } = request;
  const compute = (): Output => {
    H.domain(regulator >= 0 && basal >= 0 && maximal >= 0);
    H.positive(threshold);
    H.positive(coefficient);
    return {
      repressionFraction: 1 / (1 + (regulator / threshold) ** coefficient),
      productionRate:
        basal + maximal / (1 + (regulator / threshold) ** coefficient),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regulator: 2, threshold: 2, coefficient: 2, basal: 1, maximal: 8 },
  output: { repressionFraction: 0.5, productionRate: 5 },
} satisfies ToolExample<Input, Output>;
export const hillRepressionOneStateEvaluationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/hill-repression-one-state-evaluation",
    title: "Hill Repression One State Evaluation Tool",
    description:
      "Calculate hill repression one state evaluation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regulator: { type: "number", minimum: 0 },
        threshold: { type: "number", exclusiveMinimum: 0 },
        coefficient: { type: "number", exclusiveMinimum: 0 },
        basal: { type: "number", minimum: 0 },
        maximal: { type: "number", minimum: 0 },
      },
      required: ["regulator", "threshold", "coefficient", "basal", "maximal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repressionFraction: { type: "number" },
        productionRate: { type: "number" },
      },
      required: ["repressionFraction", "productionRate"],
    },
    ports: {
      inputs: [
        {
          id: "regulator",
          label: "Regulator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basal",
          label: "Basal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximal",
          label: "Maximal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "repressionFraction",
          label: "Repression Fraction",
          valueType: { type: "number" },
        },
        {
          id: "productionRate",
          label: "Production Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hillRepressionOneStateEvaluationTool.execute;
export default hillRepressionOneStateEvaluationTool;
