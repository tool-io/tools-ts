import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellLogWaterSaturationSimandouxInput = {
  readonly trueResistivityOhmM: number;
  readonly waterResistivityOhmM: number;
  readonly porosity: number;
  readonly shaleVolume?: number;
  readonly shaleResistivityOhmM?: number;
  readonly cementationExponent?: number;
  readonly tortuosityFactor?: number;
};

export type WellLogWaterSaturationSimandouxOutput = {
  readonly waterSaturation: number;
};

export const calculateWellLogWaterSaturationSimandoux = (
  input: WellLogWaterSaturationSimandouxInput,
): WellLogWaterSaturationSimandouxOutput => {
  const shaleVolume = input.shaleVolume ?? 0;
  const shaleResistivityOhmM = input.shaleResistivityOhmM ?? 0;
  const cementationExponent = input.cementationExponent ?? 2;
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
  if (!(shaleVolume >= 0 && shaleVolume <= 1))
    simpleError(
      "shaleVolume",
      "Shale volume must lie between zero and one.",
      "invalid_shale_volume",
    );
  if (shaleVolume > 0 && !(shaleResistivityOhmM > 0))
    simpleError(
      "shaleResistivityOhmM",
      "Shale resistivity must be positive when V_shale is greater than zero.",
      "invalid_resistivity",
    );
  if (!(cementationExponent > 0) || !(tortuosityFactor > 0))
    simpleError(
      "cementationExponent",
      "Cementation exponent and tortuosity must be positive.",
      "invalid_exponent",
    );
  const sandConductivityCoefficient =
    input.porosity ** cementationExponent /
    (tortuosityFactor * input.waterResistivityOhmM);
  const shaleConductivity =
    shaleVolume === 0 ? 0 : shaleVolume / shaleResistivityOhmM;
  const totalConductivity = 1 / input.trueResistivityOhmM;
  const waterSaturation =
    (-shaleConductivity +
      Math.sqrt(
        shaleConductivity ** 2 +
          4 * sandConductivityCoefficient * totalConductivity,
      )) /
    (2 * sandConductivityCoefficient);
  return { waterSaturation };
};

export const wellLogWaterSaturationSimandouxExample = {
  input: {
    trueResistivityOhmM: 10,
    waterResistivityOhmM: 0.05,
    porosity: 0.2,
    shaleVolume: 0.2,
    shaleResistivityOhmM: 5,
  },
  output: { waterSaturation: 0.3294361719689456 },
} satisfies ToolExample<
  WellLogWaterSaturationSimandouxInput,
  WellLogWaterSaturationSimandouxOutput
>;

export const wellLogWaterSaturationSimandouxTool = createSimpleTool({
  id: "geology/well-log-water-saturation-simandoux",
  title: "Well Log Water Saturation Simandoux Calculator",
  description:
    "Solve the Simandoux shaly-sand equation for water saturation including shale-conductivity correction.",
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
      description: "Shale resistivity in ohm metres.",
      id: "shaleResistivityOhmM",
      kind: "number",
      label: "Rsh",
    },
    {
      default: 2,
      description: "Cementation exponent m.",
      id: "cementationExponent",
      kind: "number",
      label: "m",
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
    calculateWellLogWaterSaturationSimandoux(
      input as unknown as WellLogWaterSaturationSimandouxInput,
    ),
});

export const runWellLogWaterSaturationSimandoux =
  wellLogWaterSaturationSimandouxTool.execute;
export default wellLogWaterSaturationSimandouxTool;
