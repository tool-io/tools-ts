import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly positives: number;
  readonly negatives: number;
  readonly positiveWeight: number;
  readonly negativeWeight: number;
};
export type Output = { readonly weightedPrior: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positives: { type: "integer", minimum: 0 },
    negatives: { type: "integer", minimum: 0 },
    positiveWeight: { type: "number" },
    negativeWeight: { type: "number" },
  },
  required: ["positives", "negatives", "positiveWeight", "negativeWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedPrior: { type: "number" } },
  required: ["weightedPrior"],
} as const;
/** Compute binary class weight effective prevalence from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { positives, negatives, positiveWeight, negativeWeight } = input;
  const compute = (): Output => {
    integer(positives);
    integer(negatives);
    domain(positiveWeight >= 0 && negativeWeight >= 0);
    const p = positives * positiveWeight,
      n = negatives * negativeWeight;
    positive(p + n);
    return { weightedPrior: p / (p + n) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { positives: 2, negatives: 6, positiveWeight: 3, negativeWeight: 1 },
  output: { weightedPrior: 0.5 },
} satisfies ToolExample<Input, Output>;
export const binaryClassWeightEffectivePrevalenceTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/binary-class-weight-effective-prevalence",
  title: "Binary Class Weight Effective Prevalence Tool",
  description:
    "Compute binary class weight effective prevalence from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "positives",
        label: "Positives",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "negatives",
        label: "Negatives",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "positiveWeight",
        label: "Positive Weight",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "negativeWeight",
        label: "Negative Weight",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "weightedPrior",
        label: "Weighted Prior",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = binaryClassWeightEffectivePrevalenceTool.execute;
export default binaryClassWeightEffectivePrevalenceTool;
