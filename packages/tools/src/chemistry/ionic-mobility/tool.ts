import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const IonicMobilityTool = createSimpleTool({
  id: "chemistry/ionic-mobility",
  title: "Ionic Mobility Calculator",
  description: "Compute ionic mobility mu = lambda/(z*F).",
  inputs: [
    {
      id: "ionicConductivitySCm2Mol",
      label: "Lambda",
      kind: "number",
      minimum: 0,
      unit: "S*cm2/mol",
    },
    {
      id: "chargeZ",
      label: "z",
      kind: "integer",
      description: "Charge; nonzero.",
    },
  ],
  outputs: [
    {
      id: "mobilityCm2Vs",
      label: "Mobility",
      kind: "number",
      unit: "cm2/(s*V)",
    },
  ],
  calculate: (input) => {
    const z = input.chargeZ as number;
    if (z === 0) simpleError("chargeZ", "Cannot be zero.", "invalid_z");
    return {
      mobilityCm2Vs:
        (input.ionicConductivitySCm2Mol as number) / (Math.abs(z) * 96485),
    };
  },
});
export default IonicMobilityTool;
export const runIonicMobility = IonicMobilityTool.execute;

export type IonicMobilityInput = {
  readonly ionicConductivitySCm2Mol: number;
  readonly chargeZ: number;
};

export type IonicMobilityOutput = {
  readonly mobilityCm2Vs: number;
};

export const ionicMobilityExample = {
  input: {
    ionicConductivitySCm2Mol: 1,
    chargeZ: 1,
  },
  output: {
    mobilityCm2Vs: 0.000010364305332435094,
  },
} satisfies ToolExample<IonicMobilityInput, IonicMobilityOutput>;
