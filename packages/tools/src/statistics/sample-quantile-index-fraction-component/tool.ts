import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly sampleSize: number;
  readonly probability: number;
};
export type Output = {
  readonly lowerIndex: number;
  readonly upperIndex: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSize: { type: "integer", minimum: 1, maximum: 1000000 },
    probability: { type: "number" },
  },
  required: ["sampleSize", "probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerIndex: { type: "integer" },
    upperIndex: { type: "integer" },
    fraction: { type: "number" },
  },
  required: ["lowerIndex", "upperIndex", "fraction"],
} as const;
/** Compute sample quantile index fraction component from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { sampleSize, probability } = input;
  const compute = (): Output => {
    integer(sampleSize, 1, 1000000);
    probability === probability;
    domain(probability >= 0 && probability <= 1);
    const h = (sampleSize - 1) * probability;
    return {
      lowerIndex: Math.floor(h),
      upperIndex: Math.ceil(h),
      fraction: h - Math.floor(h),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sampleSize: 4, probability: 0.5 },
  output: { lowerIndex: 1, upperIndex: 2, fraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const sampleQuantileIndexFractionComponentTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/sample-quantile-index-fraction-component",
  title: "Sample Quantile Index Fraction Component Tool",
  description:
    "Compute sample quantile index fraction component from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sampleSize",
        label: "Sample Size",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "probability",
        label: "Probability",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "lowerIndex",
        label: "Lower Index",
        valueType: { type: "integer" },
      },
      {
        id: "upperIndex",
        label: "Upper Index",
        valueType: { type: "integer" },
      },
      { id: "fraction", label: "Fraction", valueType: { type: "number" } },
    ],
  },
});
export const run = sampleQuantileIndexFractionComponentTool.execute;
export default sampleQuantileIndexFractionComponentTool;
