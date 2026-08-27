import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellLogPermeabilityWyllieRoseInput = {
  readonly coefficient: number;
  readonly porosity: number;
  readonly irreducibleWaterSaturation: number;
  readonly porosityExponent?: number;
  readonly saturationExponent?: number;
};

export type WellLogPermeabilityWyllieRoseOutput = {
  readonly permeabilityMd: number;
};

export const calculateWellLogPermeabilityWyllieRose = (
  input: WellLogPermeabilityWyllieRoseInput,
): WellLogPermeabilityWyllieRoseOutput => {
  const porosityExponent = input.porosityExponent ?? 3;
  const saturationExponent = input.saturationExponent ?? 2;
  if (!(input.coefficient > 0))
    simpleError(
      "coefficient",
      "Coefficient must be positive.",
      "invalid_coefficient",
    );
  if (!(input.porosity > 0 && input.porosity <= 1))
    simpleError(
      "porosity",
      "Porosity must lie between zero and one.",
      "invalid_porosity",
    );
  if (!(
    input.irreducibleWaterSaturation > 0 &&
    input.irreducibleWaterSaturation <= 1
  ))
    simpleError(
      "irreducibleWaterSaturation",
      "Irreducible water saturation must lie between zero and one.",
      "invalid_saturation",
    );
  if (!(porosityExponent > 0) || !(saturationExponent > 0))
    simpleError(
      "porosityExponent",
      "Exponents must be positive.",
      "invalid_exponent",
    );
  return {
    permeabilityMd:
      (input.coefficient * input.porosity ** porosityExponent) /
      input.irreducibleWaterSaturation ** saturationExponent,
  };
};

export const wellLogPermeabilityWyllieRoseExample = {
  input: { coefficient: 10000, porosity: 0.2, irreducibleWaterSaturation: 0.3 },
  output: { permeabilityMd: 888.888888888889 },
} satisfies ToolExample<
  WellLogPermeabilityWyllieRoseInput,
  WellLogPermeabilityWyllieRoseOutput
>;

export const wellLogPermeabilityWyllieRoseTool = createSimpleTool({
  id: "geology/well-log-permeability-wyllie-rose",
  title: "Well Log Permeability Wyllie Rose Calculator",
  description:
    "Estimate permeability in millidarcies from porosity and irreducible water saturation with the Wyllie-Rose power-law relation.",
  inputs: [
    {
      description: "Empirical coefficient C of the Wyllie-Rose relation.",
      id: "coefficient",
      kind: "number",
      label: "C",
    },
    {
      description: "Porosity as a volume fraction.",
      id: "porosity",
      kind: "number",
      label: "Porosity",
      maximum: 1,
    },
    {
      description: "Irreducible water saturation as a fraction.",
      id: "irreducibleWaterSaturation",
      kind: "number",
      label: "Swi",
      maximum: 1,
    },
    {
      default: 3,
      description: "Porosity exponent x.",
      id: "porosityExponent",
      kind: "number",
      label: "x",
    },
    {
      default: 2,
      description: "Irreducible saturation exponent y.",
      id: "saturationExponent",
      kind: "number",
      label: "y",
    },
  ],
  outputs: [
    {
      description: "Permeability in millidarcies.",
      id: "permeabilityMd",
      kind: "number",
      label: "k",
    },
  ],
  calculate: (input) =>
    calculateWellLogPermeabilityWyllieRose(
      input as unknown as WellLogPermeabilityWyllieRoseInput,
    ),
});

export const runWellLogPermeabilityWyllieRose =
  wellLogPermeabilityWyllieRoseTool.execute;
export default wellLogPermeabilityWyllieRoseTool;
