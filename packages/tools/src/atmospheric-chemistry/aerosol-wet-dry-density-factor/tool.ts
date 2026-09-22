import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryDensity: number;
  readonly liquidDensity: number;
  readonly wetVolumeFactor: number;
};
export type Output = {
  readonly wetDensity: number;
  readonly liquidVolumeFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryDensity: { type: "number", exclusiveMinimum: 0 },
    liquidDensity: { type: "number", exclusiveMinimum: 0 },
    wetVolumeFactor: { type: "number", minimum: 1 },
  },
  required: ["dryDensity", "liquidDensity", "wetVolumeFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetDensity: { type: "number" },
    liquidVolumeFraction: { type: "number" },
  },
  required: ["wetDensity", "liquidVolumeFraction"],
} as const;
/** Additive-volume wet aerosol density from an explicitly supplied wet/dry volume ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryDensity, liquidDensity, wetVolumeFactor } = request;
  const compute = (): Output => {
    H.positive(dryDensity);
    H.positive(liquidDensity);
    H.domain(wetVolumeFactor >= 1);
    return {
      wetDensity:
        (dryDensity + liquidDensity * (wetVolumeFactor - 1)) / wetVolumeFactor,
      liquidVolumeFraction: (wetVolumeFactor - 1) / wetVolumeFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryDensity: 2, liquidDensity: 1, wetVolumeFactor: 2 },
  output: { wetDensity: 1.5, liquidVolumeFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const aerosolWetDryDensityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/aerosol-wet-dry-density-factor",
    title: "Aerosol Wet Dry Density Factor Tool",
    description:
      "Additive-volume wet aerosol density from an explicitly supplied wet/dry volume ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryDensity: { type: "number", exclusiveMinimum: 0 },
        liquidDensity: { type: "number", exclusiveMinimum: 0 },
        wetVolumeFactor: { type: "number", minimum: 1 },
      },
      required: ["dryDensity", "liquidDensity", "wetVolumeFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetDensity: { type: "number" },
        liquidVolumeFraction: { type: "number" },
      },
      required: ["wetDensity", "liquidVolumeFraction"],
    },
    ports: {
      inputs: [
        {
          id: "dryDensity",
          label: "Dry Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidDensity",
          label: "Liquid Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetVolumeFactor",
          label: "Wet Volume Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wetDensity",
          label: "Wet Density",
          valueType: { type: "number" },
        },
        {
          id: "liquidVolumeFraction",
          label: "Liquid Volume Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = aerosolWetDryDensityFactorTool.execute;
export default aerosolWetDryDensityFactorTool;
