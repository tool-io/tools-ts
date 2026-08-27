import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellLogPorosityNeutronInput = {
  readonly neutronLogFraction: number;
  readonly shaleVolume?: number;
  readonly shaleNeutronFraction?: number;
};

export type WellLogPorosityNeutronOutput = {
  readonly correctedPorosity: number;
};

export const calculateWellLogPorosityNeutron = (
  input: WellLogPorosityNeutronInput,
): WellLogPorosityNeutronOutput => {
  const reading = input.neutronLogFraction;
  const shaleVolume = input.shaleVolume ?? 0;
  const shaleReading = input.shaleNeutronFraction ?? 0;
  if (!(reading >= 0))
    simpleError(
      "neutronLogFraction",
      "Neutron log reading must be non-negative.",
      "invalid_reading",
    );
  if (!(shaleVolume >= 0 && shaleVolume <= 1))
    simpleError(
      "shaleVolume",
      "Shale volume must lie between zero and one.",
      "invalid_shale_volume",
    );
  if (!(shaleReading >= 0))
    simpleError(
      "shaleNeutronFraction",
      "Shale neutron reading must be non-negative.",
      "invalid_reading",
    );
  return { correctedPorosity: reading - shaleVolume * shaleReading };
};

export const wellLogPorosityNeutronExample = {
  input: {
    neutronLogFraction: 0.25,
    shaleVolume: 0.2,
    shaleNeutronFraction: 0.35,
  },
  output: { correctedPorosity: 0.18 },
} satisfies ToolExample<
  WellLogPorosityNeutronInput,
  WellLogPorosityNeutronOutput
>;

export const wellLogPorosityNeutronTool = createSimpleTool({
  id: "geology/well-log-porosity-neutron",
  title: "Well Log Porosity Neutron Calculator",
  description:
    "Correct a neutron porosity log reading (limestone porosity units) for shale content using V_shale times the shale neutron reading.",
  inputs: [
    {
      description: "Neutron log reading as volumetric porosity fraction.",
      id: "neutronLogFraction",
      kind: "number",
      label: "Neutron reading",
      minimum: 0,
    },
    {
      default: 0,
      description: "Shale volume fraction from 0 to 1.",
      id: "shaleVolume",
      kind: "number",
      label: "V shale",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 0,
      description: "Neutron log reading in pure shale as fraction.",
      id: "shaleNeutronFraction",
      kind: "number",
      label: "Shale reading",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Shale-corrected porosity as a volume fraction.",
      id: "correctedPorosity",
      kind: "number",
      label: "Corrected porosity",
    },
  ],
  calculate: (input) =>
    calculateWellLogPorosityNeutron(
      input as unknown as WellLogPorosityNeutronInput,
    ),
});

export const runWellLogPorosityNeutron = wellLogPorosityNeutronTool.execute;
export default wellLogPorosityNeutronTool;
