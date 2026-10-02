import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fraction: number;
  readonly hill: number;
  readonly maximumEffect: number;
};
export type Output = {
  readonly fractionSlope: number;
  readonly effectSlope: number;
  readonly relativeElasticity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number", minimum: 0, maximum: 1 },
    hill: { type: "number", exclusiveMinimum: 0 },
    maximumEffect: { type: "number" },
  },
  required: ["fraction", "hill", "maximumEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractionSlope: { type: "number" },
    effectSlope: { type: "number" },
    relativeElasticity: { type: "number" },
  },
  required: ["fractionSlope", "effectSlope", "relativeElasticity"],
} as const;
/** Hill response sensitivity to natural log concentration at a supplied occupancy fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fraction, hill, maximumEffect } = request;
  const compute = (): Output => {
    H.probability(fraction);
    H.positive(hill);
    const fractionSlope = hill * fraction * (1 - fraction);
    return {
      fractionSlope,
      effectSlope: maximumEffect * fractionSlope,
      relativeElasticity: hill * (1 - fraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fraction: 0.5, hill: 2, maximumEffect: 10 },
  output: { fractionSlope: 0.5, effectSlope: 5, relativeElasticity: 1 },
} satisfies ToolExample<Input, Output>;
export const pdLogConcentrationEffectElasticityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/pd-log-concentration-effect-elasticity",
    title: "PD Log Concentration Effect Elasticity Tool",
    description:
      "Hill response sensitivity to natural log concentration at a supplied occupancy fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number", minimum: 0, maximum: 1 },
        hill: { type: "number", exclusiveMinimum: 0 },
        maximumEffect: { type: "number" },
      },
      required: ["fraction", "hill", "maximumEffect"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fractionSlope: { type: "number" },
        effectSlope: { type: "number" },
        relativeElasticity: { type: "number" },
      },
      required: ["fractionSlope", "effectSlope", "relativeElasticity"],
    },
    ports: {
      inputs: [
        {
          id: "fraction",
          label: "Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hill",
          label: "Hill",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumEffect",
          label: "Maximum Effect",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fractionSlope",
          label: "Fraction Slope",
          valueType: { type: "number" },
        },
        {
          id: "effectSlope",
          label: "Effect Slope",
          valueType: { type: "number" },
        },
        {
          id: "relativeElasticity",
          label: "Relative Elasticity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdLogConcentrationEffectElasticityTool.execute;
export default pdLogConcentrationEffectElasticityTool;
