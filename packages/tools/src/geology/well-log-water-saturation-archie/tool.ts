import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellLogWaterSaturationArchieInput = {
  readonly trueResistivityOhmM: number;
  readonly waterResistivityOhmM: number;
  readonly porosity: number;
  readonly cementationExponent?: number;
  readonly saturationExponent?: number;
  readonly tortuosityFactor?: number;
};

export type WellLogWaterSaturationArchieOutput = {
  readonly waterSaturation: number;
};

export const calculateWellLogWaterSaturationArchie = (
  input: WellLogWaterSaturationArchieInput,
): WellLogWaterSaturationArchieOutput => {
  const cementationExponent = input.cementationExponent ?? 2;
  const saturationExponent = input.saturationExponent ?? 2;
  const tortuosityFactor = input.tortuosityFactor ?? 1;
  if (!(input.trueResistivityOhmM > 0))
    simpleError(
      "trueResistivityOhmM",
      "True resistivity must be positive.",
      "invalid_resistivity",
    );
  if (!(input.waterResistivityOhmM > 0))
    simpleError(
      "waterResistivityOhmM",
      "Water resistivity must be positive.",
      "invalid_resistivity",
    );
  if (!(input.porosity > 0 && input.porosity <= 1))
    simpleError(
      "porosity",
      "Porosity must lie between zero and one.",
      "invalid_porosity",
    );
  if (
    !(cementationExponent > 0) ||
    !(saturationExponent > 0) ||
    !(tortuosityFactor > 0)
  )
    simpleError(
      "cementationExponent",
      "Archie exponents and tortuosity must be positive.",
      "invalid_exponent",
    );
  const waterSaturation =
    ((tortuosityFactor * input.waterResistivityOhmM) /
      (input.trueResistivityOhmM * input.porosity ** cementationExponent)) **
    (1 / saturationExponent);
  return { waterSaturation };
};

export const wellLogWaterSaturationArchieExample = {
  input: { trueResistivityOhmM: 20, waterResistivityOhmM: 0.05, porosity: 0.2 },
  output: { waterSaturation: 0.24999999999999997 },
} satisfies ToolExample<
  WellLogWaterSaturationArchieInput,
  WellLogWaterSaturationArchieOutput
>;

export const wellLogWaterSaturationArchieTool = createSimpleTool({
  id: "geology/well-log-water-saturation-archie",
  title: "Well Log Water Saturation Archie Calculator",
  description:
    "Invert the Archie equation for water saturation from true resistivity, formation water resistivity and porosity.",
  inputs: [
    {
      description: "True formation resistivity in ohm metres.",
      id: "trueResistivityOhmM",
      kind: "number",
      label: "Rt",
    },
    {
      description: "Formation water resistivity in ohm metres.",
      id: "waterResistivityOhmM",
      kind: "number",
      label: "Rw",
    },
    {
      description: "Porosity as a volume fraction.",
      id: "porosity",
      kind: "number",
      label: "Porosity",
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
      description: "Water saturation as a volume fraction.",
      id: "waterSaturation",
      kind: "number",
      label: "Sw",
    },
  ],
  calculate: (input) =>
    calculateWellLogWaterSaturationArchie(
      input as unknown as WellLogWaterSaturationArchieInput,
    ),
});

export const runWellLogWaterSaturationArchie =
  wellLogWaterSaturationArchieTool.execute;
export default wellLogWaterSaturationArchieTool;
