import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly solidMassFraction: number;
  readonly solidDensity: number;
  readonly liquidDensity: number;
};
export type Output = {
  readonly solidVolumeFraction: number;
  readonly mixtureDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidMassFraction: { type: "number", minimum: 0, maximum: 1 },
    solidDensity: { type: "number", exclusiveMinimum: 0 },
    liquidDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["solidMassFraction", "solidDensity", "liquidDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidVolumeFraction: { type: "number" },
    mixtureDensity: { type: "number" },
  },
  required: ["solidVolumeFraction", "mixtureDensity"],
} as const;
/** Additive solid/liquid phase volumes with explicit phase densities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { solidMassFraction, solidDensity, liquidDensity } = request;
  const compute = (): Output => {
    H.probability(solidMassFraction);
    H.positive(solidDensity);
    H.positive(liquidDensity);
    return {
      solidVolumeFraction:
        solidMassFraction /
        solidDensity /
        (solidMassFraction / solidDensity +
          (1 - solidMassFraction) / liquidDensity),
      mixtureDensity:
        1 /
        (solidMassFraction / solidDensity +
          (1 - solidMassFraction) / liquidDensity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { solidMassFraction: 0.5, solidDensity: 2, liquidDensity: 1 },
  output: {
    solidVolumeFraction: 0.3333333333333333,
    mixtureDensity: 1.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const slurrySolidVolumeMassCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/slurry-solid-volume-mass-crosswalk",
    title: "Slurry Solid Volume Mass Crosswalk Tool",
    description:
      "Additive solid/liquid phase volumes with explicit phase densities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidMassFraction: { type: "number", minimum: 0, maximum: 1 },
        solidDensity: { type: "number", exclusiveMinimum: 0 },
        liquidDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["solidMassFraction", "solidDensity", "liquidDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidVolumeFraction: { type: "number" },
        mixtureDensity: { type: "number" },
      },
      required: ["solidVolumeFraction", "mixtureDensity"],
    },
    ports: {
      inputs: [
        {
          id: "solidMassFraction",
          label: "Solid Mass Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidDensity",
          label: "Solid Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidDensity",
          label: "Liquid Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "solidVolumeFraction",
          label: "Solid Volume Fraction",
          valueType: { type: "number" },
        },
        {
          id: "mixtureDensity",
          label: "Mixture Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = slurrySolidVolumeMassCrosswalkTool.execute;
export default slurrySolidVolumeMassCrosswalkTool;
