import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLength: number;
  readonly firstDiffusivity: number;
  readonly secondLength: number;
  readonly secondDiffusivity: number;
};
export type Output = { readonly timeScaleRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLength: { type: "number", minimum: 0 },
    firstDiffusivity: { type: "number", exclusiveMinimum: 0 },
    secondLength: { type: "number", exclusiveMinimum: 0 },
    secondDiffusivity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstLength",
    "firstDiffusivity",
    "secondLength",
    "secondDiffusivity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { timeScaleRatio: { type: "number" } },
  required: ["timeScaleRatio"],
} as const;
/** Compare L²/D scales under the same geometry convention, without a diffusion model fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLength, firstDiffusivity, secondLength, secondDiffusivity } =
    request;
  const compute = (): Output => {
    H.domain(firstLength >= 0);
    H.positive(secondLength);
    H.positive(firstDiffusivity);
    H.positive(secondDiffusivity);
    return {
      timeScaleRatio:
        ((firstLength / secondLength) ** 2 * secondDiffusivity) /
        firstDiffusivity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLength: 2,
    firstDiffusivity: 1,
    secondLength: 1,
    secondDiffusivity: 2,
  },
  output: { timeScaleRatio: 8 },
} satisfies ToolExample<Input, Output>;
export const diffusionTimeScaleRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/diffusion-time-scale-ratio",
    title: "Diffusion Time Scale Ratio Tool",
    description:
      "Compare L²/D scales under the same geometry convention, without a diffusion model fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLength: { type: "number", minimum: 0 },
        firstDiffusivity: { type: "number", exclusiveMinimum: 0 },
        secondLength: { type: "number", exclusiveMinimum: 0 },
        secondDiffusivity: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstLength",
        "firstDiffusivity",
        "secondLength",
        "secondDiffusivity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { timeScaleRatio: { type: "number" } },
      required: ["timeScaleRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstLength",
          label: "First Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDiffusivity",
          label: "First Diffusivity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLength",
          label: "Second Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDiffusivity",
          label: "Second Diffusivity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "timeScaleRatio",
          label: "Time Scale Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = diffusionTimeScaleRatioTool.execute;
export default diffusionTimeScaleRatioTool;
