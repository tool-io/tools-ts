import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineExposure: number;
  readonly projectExposure: number;
  readonly damagePerUnit: number;
  readonly affectedUnits: number;
};
export type Output = {
  readonly avoidedExposure: number;
  readonly avoidedDamage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineExposure: { type: "number", minimum: 0 },
    projectExposure: { type: "number", minimum: 0 },
    damagePerUnit: { type: "number" },
    affectedUnits: { type: "number", minimum: 0 },
  },
  required: [
    "baselineExposure",
    "projectExposure",
    "damagePerUnit",
    "affectedUnits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    avoidedExposure: { type: "number" },
    avoidedDamage: { type: "number" },
  },
  required: ["avoidedExposure", "avoidedDamage"],
} as const;
/** Linear damage-factor scenario with explicit exposure and valuation; no causal or dose-response estimation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineExposure, projectExposure, damagePerUnit, affectedUnits } =
    request;
  const compute = (): Output => {
    H.domain(
      baselineExposure >= 0 && projectExposure >= 0 && affectedUnits >= 0,
    );
    return {
      avoidedExposure: baselineExposure - projectExposure,
      avoidedDamage:
        (baselineExposure - projectExposure) * damagePerUnit * affectedUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baselineExposure: 10,
    projectExposure: 6,
    damagePerUnit: 20,
    affectedUnits: 100,
  },
  output: { avoidedExposure: 4, avoidedDamage: 8000 },
} satisfies ToolExample<Input, Output>;
export const avoidedDamageOneExposureFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/avoided-damage-one-exposure-factor",
    title: "Avoided Damage One Exposure Factor Tool",
    description:
      "Linear damage-factor scenario with explicit exposure and valuation; no causal or dose-response estimation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineExposure: { type: "number", minimum: 0 },
        projectExposure: { type: "number", minimum: 0 },
        damagePerUnit: { type: "number" },
        affectedUnits: { type: "number", minimum: 0 },
      },
      required: [
        "baselineExposure",
        "projectExposure",
        "damagePerUnit",
        "affectedUnits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        avoidedExposure: { type: "number" },
        avoidedDamage: { type: "number" },
      },
      required: ["avoidedExposure", "avoidedDamage"],
    },
    ports: {
      inputs: [
        {
          id: "baselineExposure",
          label: "Baseline Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "projectExposure",
          label: "Project Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "damagePerUnit",
          label: "Damage Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "affectedUnits",
          label: "Affected Units",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "avoidedExposure",
          label: "Avoided Exposure",
          valueType: { type: "number" },
        },
        {
          id: "avoidedDamage",
          label: "Avoided Damage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = avoidedDamageOneExposureFactorTool.execute;
export default avoidedDamageOneExposureFactorTool;
