import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly exposure: number;
  readonly totalExposure: number;
};
export type Output = {
  readonly exposureShare: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    exposure: { type: "number", minimum: 0 },
    totalExposure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["count", "exposure", "totalExposure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposureShare: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["exposureShare", "contribution"],
} as const;
/** Calculate microbial count exposure share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, exposure, totalExposure } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.positive(totalExposure);
    H.domain(exposure >= 0 && exposure <= totalExposure);
    return {
      exposureShare: exposure / totalExposure,
      contribution: (count * exposure) / totalExposure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 12, exposure: 2, totalExposure: 8 },
  output: { exposureShare: 0.25, contribution: 3 },
} satisfies ToolExample<Input, Output>;
export const microbialCountExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/microbial-count-exposure-share",
    title: "Microbial Count Exposure Share Tool",
    description:
      "Calculate microbial count exposure share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        exposure: { type: "number", minimum: 0 },
        totalExposure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["count", "exposure", "totalExposure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposureShare: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["exposureShare", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exposure",
          label: "Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalExposure",
          label: "Total Exposure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "exposureShare",
          label: "Exposure Share",
          valueType: { type: "number" },
        },
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
export const run = microbialCountExposureShareTool.execute;
export default microbialCountExposureShareTool;
