import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly knownArea: number;
  readonly knownRichness: number;
  readonly targetArea: number;
  readonly exponent: number;
};
export type Output = {
  readonly areaFactor: number;
  readonly predictedRichness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownArea: { type: "number", exclusiveMinimum: 0 },
    knownRichness: { type: "number", minimum: 0 },
    targetArea: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: ["knownArea", "knownRichness", "targetArea", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaFactor: { type: "number" },
    predictedRichness: { type: "number" },
  },
  required: ["areaFactor", "predictedRichness"],
} as const;
/** Reference-normalized species-area power relation using a supplied exponent, returning an expectation without species-count rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { knownArea, knownRichness, targetArea, exponent } = request;
  const compute = (): Output => {
    H.positive(knownArea);
    H.positive(targetArea);
    H.domain(knownRichness >= 0);
    return {
      areaFactor: (targetArea / knownArea) ** exponent,
      predictedRichness: knownRichness * (targetArea / knownArea) ** exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { knownArea: 100, knownRichness: 20, targetArea: 400, exponent: 0.5 },
  output: { areaFactor: 2, predictedRichness: 40 },
} satisfies ToolExample<Input, Output>;
export const speciesAreaPowerOneScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/species-area-power-one-scale-factor",
    title: "Species Area Power One Scale Factor Tool",
    description:
      "Reference-normalized species-area power relation using a supplied exponent, returning an expectation without species-count rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownArea: { type: "number", exclusiveMinimum: 0 },
        knownRichness: { type: "number", minimum: 0 },
        targetArea: { type: "number", exclusiveMinimum: 0 },
        exponent: { type: "number" },
      },
      required: ["knownArea", "knownRichness", "targetArea", "exponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaFactor: { type: "number" },
        predictedRichness: { type: "number" },
      },
      required: ["areaFactor", "predictedRichness"],
    },
    ports: {
      inputs: [
        {
          id: "knownArea",
          label: "Known Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "knownRichness",
          label: "Known Richness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetArea",
          label: "Target Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaFactor",
          label: "Area Factor",
          valueType: { type: "number" },
        },
        {
          id: "predictedRichness",
          label: "Predicted Richness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speciesAreaPowerOneScaleFactorTool.execute;
export default speciesAreaPowerOneScaleFactorTool;
