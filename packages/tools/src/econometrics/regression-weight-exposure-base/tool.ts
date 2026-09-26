import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawWeight: number;
  readonly exposure: number;
  readonly useExposure: boolean;
};
export type Output = { readonly effectiveWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawWeight: { type: "number", minimum: 0 },
    exposure: { type: "number", minimum: 0 },
    useExposure: { type: "boolean" },
  },
  required: ["rawWeight", "exposure", "useExposure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveWeight: { type: "number" } },
  required: ["effectiveWeight"],
} as const;
/** Multiply an explicitly supplied regression weight by exposure only under the caller’s chosen basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawWeight, exposure, useExposure } = request;
  const compute = (): Output => {
    H.domain(rawWeight >= 0 && exposure >= 0);
    return { effectiveWeight: rawWeight * (useExposure ? exposure : 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawWeight: 2, exposure: 5, useExposure: true },
  output: { effectiveWeight: 10 },
} satisfies ToolExample<Input, Output>;
export const regressionWeightExposureBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/regression-weight-exposure-base",
    title: "Regression Weight Exposure Base Tool",
    description:
      "Multiply an explicitly supplied regression weight by exposure only under the caller’s chosen basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawWeight: { type: "number", minimum: 0 },
        exposure: { type: "number", minimum: 0 },
        useExposure: { type: "boolean" },
      },
      required: ["rawWeight", "exposure", "useExposure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effectiveWeight: { type: "number" } },
      required: ["effectiveWeight"],
    },
    ports: {
      inputs: [
        {
          id: "rawWeight",
          label: "Raw Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposure",
          label: "Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useExposure",
          label: "Use Exposure",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "effectiveWeight",
          label: "Effective Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = regressionWeightExposureBaseTool.execute;
export default regressionWeightExposureBaseTool;
