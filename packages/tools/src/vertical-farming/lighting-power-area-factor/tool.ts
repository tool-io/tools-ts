import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly power: number;
  readonly litArea: number;
  readonly suppliedDutyFraction: number;
};
export type Output = {
  readonly powerPerArea: number;
  readonly meanPowerPerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    power: { type: "number", minimum: 0 },
    litArea: { type: "number", exclusiveMinimum: 0 },
    suppliedDutyFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["power", "litArea", "suppliedDutyFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    powerPerArea: { type: "number" },
    meanPowerPerArea: { type: "number" },
  },
  required: ["powerPerArea", "meanPowerPerArea"],
} as const;
/** Compute supplied electrical power per area without inferring plant photon flux or recommending lighting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { power, litArea, suppliedDutyFraction } = request;
  const compute = (): Output => {
    H.positive(litArea);
    H.domain(power >= 0);
    H.probability(suppliedDutyFraction);
    return {
      powerPerArea: power / litArea,
      meanPowerPerArea: (power / litArea) * suppliedDutyFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { power: 100, litArea: 2, suppliedDutyFraction: 0.5 },
  output: { powerPerArea: 50, meanPowerPerArea: 25 },
} satisfies ToolExample<Input, Output>;
export const lightingPowerAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/lighting-power-area-factor",
    title: "Lighting Power Area Factor Tool",
    description:
      "Compute supplied electrical power per area without inferring plant photon flux or recommending lighting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        power: { type: "number", minimum: 0 },
        litArea: { type: "number", exclusiveMinimum: 0 },
        suppliedDutyFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["power", "litArea", "suppliedDutyFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        powerPerArea: { type: "number" },
        meanPowerPerArea: { type: "number" },
      },
      required: ["powerPerArea", "meanPowerPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "power",
          label: "Power",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "litArea",
          label: "Lit Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDutyFraction",
          label: "Supplied Duty Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "powerPerArea",
          label: "Power Per Area",
          valueType: { type: "number" },
        },
        {
          id: "meanPowerPerArea",
          label: "Mean Power Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lightingPowerAreaFactorTool.execute;
export default lightingPowerAreaFactorTool;
