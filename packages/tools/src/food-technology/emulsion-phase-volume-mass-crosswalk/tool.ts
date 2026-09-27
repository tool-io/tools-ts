import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseVolume: number;
  readonly phaseDensity: number;
  readonly otherVolume: number;
  readonly otherDensity: number;
};
export type Output = {
  readonly phaseMass: number;
  readonly massFraction: number;
  readonly volumeFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseVolume: { type: "number", minimum: 0 },
    phaseDensity: { type: "number", exclusiveMinimum: 0 },
    otherVolume: { type: "number", minimum: 0 },
    otherDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["phaseVolume", "phaseDensity", "otherVolume", "otherDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseMass: { type: "number" },
    massFraction: { type: "number" },
    volumeFraction: { type: "number" },
  },
  required: ["phaseMass", "massFraction", "volumeFraction"],
} as const;
/** Calculate emulsion phase volume mass crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseVolume, phaseDensity, otherVolume, otherDensity } = request;
  const compute = (): Output => {
    H.domain(
      phaseVolume >= 0 && otherVolume >= 0 && phaseVolume + otherVolume > 0,
    );
    H.positive(phaseDensity);
    H.positive(otherDensity);
    return {
      phaseMass: phaseVolume * phaseDensity,
      massFraction:
        (phaseVolume * phaseDensity) /
        (phaseVolume * phaseDensity + otherVolume * otherDensity),
      volumeFraction: phaseVolume / (phaseVolume + otherVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    phaseVolume: 10,
    phaseDensity: 0.8,
    otherVolume: 20,
    otherDensity: 1,
  },
  output: {
    phaseMass: 8,
    massFraction: 0.2857142857142857,
    volumeFraction: 0.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const emulsionPhaseVolumeMassCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/emulsion-phase-volume-mass-crosswalk",
    title: "Emulsion Phase Volume Mass Crosswalk Tool",
    description:
      "Calculate emulsion phase volume mass crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseVolume: { type: "number", minimum: 0 },
        phaseDensity: { type: "number", exclusiveMinimum: 0 },
        otherVolume: { type: "number", minimum: 0 },
        otherDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["phaseVolume", "phaseDensity", "otherVolume", "otherDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseMass: { type: "number" },
        massFraction: { type: "number" },
        volumeFraction: { type: "number" },
      },
      required: ["phaseMass", "massFraction", "volumeFraction"],
    },
    ports: {
      inputs: [
        {
          id: "phaseVolume",
          label: "Phase Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phaseDensity",
          label: "Phase Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherVolume",
          label: "Other Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherDensity",
          label: "Other Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "phaseMass", label: "Phase Mass", valueType: { type: "number" } },
        {
          id: "massFraction",
          label: "Mass Fraction",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "volumeFraction",
          label: "Volume Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = emulsionPhaseVolumeMassCrosswalkTool.execute;
export default emulsionPhaseVolumeMassCrosswalkTool;
