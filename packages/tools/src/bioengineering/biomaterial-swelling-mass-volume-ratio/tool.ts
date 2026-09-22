import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMass: number;
  readonly wetMass: number;
  readonly dryVolume: number;
  readonly wetVolume: number;
};
export type Output = {
  readonly massSwellingRatio: number;
  readonly volumeSwellingRatio: number;
  readonly linearIsotropicFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", exclusiveMinimum: 0 },
    wetMass: { type: "number", minimum: 0 },
    dryVolume: { type: "number", exclusiveMinimum: 0 },
    wetVolume: { type: "number", minimum: 0 },
  },
  required: ["dryMass", "wetMass", "dryVolume", "wetVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massSwellingRatio: { type: "number" },
    volumeSwellingRatio: { type: "number" },
    linearIsotropicFactor: { type: "number" },
  },
  required: [
    "massSwellingRatio",
    "volumeSwellingRatio",
    "linearIsotropicFactor",
  ],
} as const;
/** Wet/dry ratios with ideal isotropic linear stretch from the cube root of the volume ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, wetMass, dryVolume, wetVolume } = request;
  const compute = (): Output => {
    H.positive(dryMass);
    H.positive(dryVolume);
    H.domain(wetMass >= 0 && wetVolume >= 0);
    return {
      massSwellingRatio: wetMass / dryMass,
      volumeSwellingRatio: wetVolume / dryVolume,
      linearIsotropicFactor: Math.cbrt(wetVolume / dryVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryMass: 10, wetMass: 20, dryVolume: 5, wetVolume: 40 },
  output: {
    massSwellingRatio: 2,
    volumeSwellingRatio: 8,
    linearIsotropicFactor: 2,
  },
} satisfies ToolExample<Input, Output>;
export const biomaterialSwellingMassVolumeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/biomaterial-swelling-mass-volume-ratio",
    title: "Biomaterial Swelling Mass Volume Ratio Tool",
    description:
      "Wet/dry ratios with ideal isotropic linear stretch from the cube root of the volume ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number", exclusiveMinimum: 0 },
        wetMass: { type: "number", minimum: 0 },
        dryVolume: { type: "number", exclusiveMinimum: 0 },
        wetVolume: { type: "number", minimum: 0 },
      },
      required: ["dryMass", "wetMass", "dryVolume", "wetVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massSwellingRatio: { type: "number" },
        volumeSwellingRatio: { type: "number" },
        linearIsotropicFactor: { type: "number" },
      },
      required: [
        "massSwellingRatio",
        "volumeSwellingRatio",
        "linearIsotropicFactor",
      ],
    },
    ports: {
      inputs: [
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryVolume",
          label: "Dry Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetVolume",
          label: "Wet Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massSwellingRatio",
          label: "Mass Swelling Ratio",
          valueType: { type: "number" },
        },
        {
          id: "volumeSwellingRatio",
          label: "Volume Swelling Ratio",
          valueType: { type: "number" },
        },
        {
          id: "linearIsotropicFactor",
          label: "Linear Isotropic Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomaterialSwellingMassVolumeRatioTool.execute;
export default biomaterialSwellingMassVolumeRatioTool;
