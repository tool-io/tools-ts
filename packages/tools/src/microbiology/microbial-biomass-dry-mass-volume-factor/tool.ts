import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossDryMass: number;
  readonly filterTare: number;
  readonly blankNetMass: number;
  readonly sampleVolume: number;
};
export type Output = {
  readonly netDryMass: number;
  readonly dryMassPerVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossDryMass: { type: "number", minimum: 0 },
    filterTare: { type: "number", minimum: 0 },
    blankNetMass: { type: "number" },
    sampleVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["grossDryMass", "filterTare", "blankNetMass", "sampleVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netDryMass: { type: "number" },
    dryMassPerVolume: { type: "number" },
  },
  required: ["netDryMass", "dryMassPerVolume"],
} as const;
/** Signed blank- and tare-corrected dry biomass per supplied volume, without organism identification or biomass calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossDryMass, filterTare, blankNetMass, sampleVolume } = request;
  const compute = (): Output => {
    H.domain(grossDryMass >= 0 && filterTare >= 0);
    H.positive(sampleVolume);
    return {
      netDryMass: grossDryMass - filterTare - blankNetMass,
      dryMassPerVolume:
        (grossDryMass - filterTare - blankNetMass) / sampleVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossDryMass: 1.2,
    filterTare: 1,
    blankNetMass: 0.02,
    sampleVolume: 0.1,
  },
  output: {
    netDryMass: 0.17999999999999997,
    dryMassPerVolume: 1.7999999999999996,
  },
} satisfies ToolExample<Input, Output>;
export const microbialBiomassDryMassVolumeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "microbiology/microbial-biomass-dry-mass-volume-factor",
      title: "Microbial Biomass Dry Mass Volume Factor Tool",
      description:
        "Signed blank- and tare-corrected dry biomass per supplied volume, without organism identification or biomass calibration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossDryMass: { type: "number", minimum: 0 },
          filterTare: { type: "number", minimum: 0 },
          blankNetMass: { type: "number" },
          sampleVolume: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "grossDryMass",
          "filterTare",
          "blankNetMass",
          "sampleVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netDryMass: { type: "number" },
          dryMassPerVolume: { type: "number" },
        },
        required: ["netDryMass", "dryMassPerVolume"],
      },
      ports: {
        inputs: [
          {
            id: "grossDryMass",
            label: "Gross Dry Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "filterTare",
            label: "Filter Tare",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blankNetMass",
            label: "Blank Net Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleVolume",
            label: "Sample Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netDryMass",
            label: "Net Dry Mass",
            valueType: { type: "number" },
          },
          {
            id: "dryMassPerVolume",
            label: "Dry Mass Per Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = microbialBiomassDryMassVolumeFactorTool.execute;
export default microbialBiomassDryMassVolumeFactorTool;
