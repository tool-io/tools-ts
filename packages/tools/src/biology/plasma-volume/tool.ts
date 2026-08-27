import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlasmaVolumeInput = {
  readonly bloodVolumeMl: number;
  readonly hematocritFraction: number;
};

export type PlasmaVolumeOutput = {
  readonly plasmaVolumeMl: number;
};

export const plasmaVolumeExample = {
  input: { bloodVolumeMl: 5000, hematocritFraction: 0.45 },
  output: { plasmaVolumeMl: 2750 },
} satisfies ToolExample<PlasmaVolumeInput, PlasmaVolumeOutput>;

export const plasmaVolumeTool = createSimpleTool({
  id: "biology/plasma-volume",
  title: "Plasma Volume mL",
  description:
    "Compute the plasma volume as blood volume times one minus the hematocrit fraction.",
  inputs: [
    { id: "bloodVolumeMl", label: "Blood volume", kind: "number", unit: "mL" },
    {
      id: "hematocritFraction",
      label: "Hematocrit fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "plasmaVolumeMl",
      label: "Plasma volume",
      kind: "number",
      unit: "mL",
    },
  ],
  calculate: (input) => {
    const bloodVolumeMl = input.bloodVolumeMl as number;
    if (bloodVolumeMl <= 0)
      simpleError(
        "bloodVolumeMl",
        "The blood volume must be greater than zero.",
      );
    return {
      plasmaVolumeMl:
        bloodVolumeMl * (1 - (input.hematocritFraction as number)),
    };
  },
});
export const runPlasmaVolume = plasmaVolumeTool.execute;
export default plasmaVolumeTool;
