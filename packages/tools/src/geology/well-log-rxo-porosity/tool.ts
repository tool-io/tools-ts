import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellLogRxoPorosityInput = {
  readonly flushedZoneResistivityOhmM: number;
  readonly mudFiltrateResistivityOhmM: number;
  readonly flushedZoneWaterSaturation?: number;
  readonly cementationExponent?: number;
  readonly saturationExponent?: number;
  readonly tortuosityFactor?: number;
};

export type WellLogRxoPorosityOutput = {
  readonly flushedZonePorosity: number;
};

export const calculateWellLogRxoPorosity = (
  input: WellLogRxoPorosityInput,
): WellLogRxoPorosityOutput => {
  const flushedZoneWaterSaturation = input.flushedZoneWaterSaturation ?? 1;
  const cementationExponent = input.cementationExponent ?? 2;
  const saturationExponent = input.saturationExponent ?? 2;
  const tortuosityFactor = input.tortuosityFactor ?? 1;
  if (!(input.flushedZoneResistivityOhmM > 0))
    simpleError(
      "flushedZoneResistivityOhmM",
      "Flushed-zone resistivity must be positive.",
      "invalid_resistivity",
    );
  if (!(input.mudFiltrateResistivityOhmM > 0))
    simpleError(
      "mudFiltrateResistivityOhmM",
      "Mud filtrate resistivity must be positive.",
      "invalid_resistivity",
    );
  if (
    !(flushedZoneWaterSaturation > 0 && flushedZoneWaterSaturation <= 1) ||
    !(cementationExponent > 0) ||
    !(saturationExponent > 0) ||
    !(tortuosityFactor > 0)
  )
    simpleError(
      "flushedZoneWaterSaturation",
      "Saturation, exponents and tortuosity must be positive.",
      "invalid_exponent",
    );
  const flushedZonePorosity =
    ((tortuosityFactor * input.mudFiltrateResistivityOhmM) /
      (input.flushedZoneResistivityOhmM *
        flushedZoneWaterSaturation ** saturationExponent)) **
    (1 / cementationExponent);
  return { flushedZonePorosity };
};

export const wellLogRxoPorosityExample = {
  input: { flushedZoneResistivityOhmM: 10, mudFiltrateResistivityOhmM: 0.4 },
  output: { flushedZonePorosity: 0.2 },
} satisfies ToolExample<WellLogRxoPorosityInput, WellLogRxoPorosityOutput>;

export const wellLogRxoPorosityTool = createSimpleTool({
  id: "geology/well-log-rxo-porosity",
  title: "Well Log Rxo Porosity Calculator",
  description:
    "Invert the Archie equation in the flushed zone to estimate porosity from Rxo and mud-filtrate resistivity.",
  inputs: [
    {
      description: "Flushed-zone resistivity Rxo in ohm metres.",
      id: "flushedZoneResistivityOhmM",
      kind: "number",
      label: "Rxo",
    },
    {
      description: "Mud filtrate resistivity Rmf in ohm metres.",
      id: "mudFiltrateResistivityOhmM",
      kind: "number",
      label: "Rmf",
    },
    {
      default: 1,
      description: "Flushed-zone water saturation Sxo as a fraction.",
      id: "flushedZoneWaterSaturation",
      kind: "number",
      label: "Sxo",
      maximum: 1,
    },
    {
      default: 2,
      description: "Cementation exponent m.",
      id: "cementationExponent",
      kind: "number",
      label: "m",
    },
    {
      default: 2,
      description: "Saturation exponent n.",
      id: "saturationExponent",
      kind: "number",
      label: "n",
    },
    {
      default: 1,
      description: "Tortuosity factor a.",
      id: "tortuosityFactor",
      kind: "number",
      label: "a",
    },
  ],
  outputs: [
    {
      description: "Flushed-zone porosity as a volume fraction.",
      id: "flushedZonePorosity",
      kind: "number",
      label: "Phi xo",
    },
  ],
  calculate: (input) =>
    calculateWellLogRxoPorosity(input as unknown as WellLogRxoPorosityInput),
});

export const runWellLogRxoPorosity = wellLogRxoPorosityTool.execute;
export default wellLogRxoPorosityTool;
