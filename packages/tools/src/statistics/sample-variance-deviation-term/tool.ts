import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observation: number;
  readonly sampleMean: number;
  readonly sampleSize: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observation: { type: "number" },
    sampleMean: { type: "number" },
    sampleSize: { type: "integer", minimum: 2 },
  },
  required: ["observation", "sampleMean", "sampleSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Return one observation's squared-deviation contribution to sample variance using the supplied mean and n-1 denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observation, sampleMean, sampleSize } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sampleSize) &&
        sampleSize >= 2 &&
        sampleSize <= Number.MAX_SAFE_INTEGER,
      "sampleSize",
    ),
      sampleSize);
    return { contribution: (observation - sampleMean) ** 2 / (sampleSize - 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observation: 7, sampleMean: 5, sampleSize: 5 },
  output: { contribution: 1 },
} satisfies ToolExample<Input, Output>;
export const sampleVarianceDeviationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/sample-variance-deviation-term",
    title: "Sample Variance Deviation Term Tool",
    description:
      "Return one observation's squared-deviation contribution to sample variance using the supplied mean and n-1 denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observation: { type: "number" },
        sampleMean: { type: "number" },
        sampleSize: { type: "integer", minimum: 2 },
      },
      required: ["observation", "sampleMean", "sampleSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "observation",
          label: "Observation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleMean",
          label: "Sample Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleSize",
          label: "Sample Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleVarianceDeviationTermTool.execute;
export default sampleVarianceDeviationTermTool;
