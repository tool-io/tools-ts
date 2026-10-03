import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSize: number;
  readonly sampleVariance: number;
};
export type Output = {
  readonly degreesOfFreedom: number;
  readonly numerator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSize: { type: "integer", minimum: 2 },
    sampleVariance: { type: "number", minimum: 0 },
  },
  required: ["sampleSize", "sampleVariance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degreesOfFreedom: { type: "integer" },
    numerator: { type: "number" },
  },
  required: ["degreesOfFreedom", "numerator"],
} as const;
/** Calculate pooled variance one stratum numerator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSize, sampleVariance } = request;
  const compute = (): Output => {
    H.integer(sampleSize, 2);
    H.domain(sampleVariance >= 0);
    return {
      degreesOfFreedom: sampleSize - 1,
      numerator: (sampleSize - 1) * sampleVariance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSize: 5, sampleVariance: 3 },
  output: { degreesOfFreedom: 4, numerator: 12 },
} satisfies ToolExample<Input, Output>;
export const pooledVarianceOneStratumNumeratorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/pooled-variance-one-stratum-numerator",
    title: "Pooled Variance One Stratum Numerator Tool",
    description:
      "Calculate pooled variance one stratum numerator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSize: { type: "integer", minimum: 2 },
        sampleVariance: { type: "number", minimum: 0 },
      },
      required: ["sampleSize", "sampleVariance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degreesOfFreedom: { type: "integer" },
        numerator: { type: "number" },
      },
      required: ["degreesOfFreedom", "numerator"],
    },
    ports: {
      inputs: [
        {
          id: "sampleSize",
          label: "Sample Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleVariance",
          label: "Sample Variance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "degreesOfFreedom",
          label: "Degrees Of Freedom",
          valueType: { type: "integer" },
        },
        { id: "numerator", label: "Numerator", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pooledVarianceOneStratumNumeratorTool.execute;
export default pooledVarianceOneStratumNumeratorTool;
