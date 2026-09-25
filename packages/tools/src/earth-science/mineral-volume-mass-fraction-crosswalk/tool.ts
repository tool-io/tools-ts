import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVolumeFraction: number;
  readonly firstDensity: number;
  readonly secondDensity: number;
};
export type Output = {
  readonly mixtureDensity: number;
  readonly firstMassFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVolumeFraction: { type: "number", minimum: 0, maximum: 1 },
    firstDensity: { type: "number", exclusiveMinimum: 0 },
    secondDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstVolumeFraction", "firstDensity", "secondDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mixtureDensity: { type: "number" },
    firstMassFraction: { type: "number" },
  },
  required: ["mixtureDensity", "firstMassFraction"],
} as const;
/** Two-mineral additive-volume density and mass-fraction conversion, excluding pore space. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVolumeFraction, firstDensity, secondDensity } = request;
  const compute = (): Output => {
    H.probability(firstVolumeFraction);
    H.positive(firstDensity);
    H.positive(secondDensity);
    return {
      mixtureDensity:
        firstVolumeFraction * firstDensity +
        (1 - firstVolumeFraction) * secondDensity,
      firstMassFraction:
        (firstVolumeFraction * firstDensity) /
        (firstVolumeFraction * firstDensity +
          (1 - firstVolumeFraction) * secondDensity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstVolumeFraction: 0.5, firstDensity: 3000, secondDensity: 2000 },
  output: { mixtureDensity: 2500, firstMassFraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const mineralVolumeMassFractionCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/mineral-volume-mass-fraction-crosswalk",
    title: "Mineral Volume Mass Fraction Crosswalk Tool",
    description:
      "Two-mineral additive-volume density and mass-fraction conversion, excluding pore space.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVolumeFraction: { type: "number", minimum: 0, maximum: 1 },
        firstDensity: { type: "number", exclusiveMinimum: 0 },
        secondDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstVolumeFraction", "firstDensity", "secondDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mixtureDensity: { type: "number" },
        firstMassFraction: { type: "number" },
      },
      required: ["mixtureDensity", "firstMassFraction"],
    },
    ports: {
      inputs: [
        {
          id: "firstVolumeFraction",
          label: "First Volume Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDensity",
          label: "First Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDensity",
          label: "Second Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mixtureDensity",
          label: "Mixture Density",
          valueType: { type: "number" },
        },
        {
          id: "firstMassFraction",
          label: "First Mass Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mineralVolumeMassFractionCrosswalkTool.execute;
export default mineralVolumeMassFractionCrosswalkTool;
