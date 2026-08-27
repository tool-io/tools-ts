import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RockPorosityCalculatorInput = {
  readonly bulkVolumeM3: number;
  readonly poreVolumeM3: number;
};

export type RockPorosityCalculatorOutput = {
  readonly porosityFraction: number;
  readonly porosityPercent: number;
};

export const calculateRockPorosityCalculator = (
  input: RockPorosityCalculatorInput,
): RockPorosityCalculatorOutput => {
  if (!(input.bulkVolumeM3 > 0))
    simpleError(
      "bulkVolumeM3",
      "Bulk volume must be greater than zero.",
      "invalid_volume",
    );
  if (!(input.poreVolumeM3 >= 0))
    simpleError(
      "poreVolumeM3",
      "Pore volume cannot be negative.",
      "invalid_volume",
    );
  if (input.poreVolumeM3 > input.bulkVolumeM3)
    simpleError(
      "poreVolumeM3",
      "Pore volume cannot exceed the bulk volume.",
      "invalid_volume",
    );
  const porosityFraction = input.poreVolumeM3 / input.bulkVolumeM3;
  return { porosityFraction, porosityPercent: porosityFraction * 100 };
};

export const rockPorosityCalculatorExample = {
  input: { bulkVolumeM3: 1, poreVolumeM3: 0.25 },
  output: { porosityFraction: 0.25, porosityPercent: 25 },
} satisfies ToolExample<
  RockPorosityCalculatorInput,
  RockPorosityCalculatorOutput
>;

export const rockPorosityCalculatorTool = createSimpleTool({
  id: "geology/rock-porosity-calculator",
  title: "Rock Porosity Calculator",
  description:
    "Compute the porosity fraction and percentage of a rock sample from its pore volume and bulk volume.",
  inputs: [
    {
      description: "Total (bulk) volume of the rock sample in cubic meters.",
      id: "bulkVolumeM3",
      kind: "number",
      label: "Bulk volume",
      minimum: 0,
    },
    {
      description: "Pore (void) space volume in cubic meters.",
      id: "poreVolumeM3",
      kind: "number",
      label: "Pore volume",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Porosity as a fraction of bulk volume (dimensionless).",
      id: "porosityFraction",
      kind: "number",
      label: "Porosity fraction",
    },
    {
      description: "Porosity expressed in percent.",
      id: "porosityPercent",
      kind: "number",
      label: "Porosity percent",
    },
  ],
  calculate: (input) =>
    calculateRockPorosityCalculator(
      input as unknown as RockPorosityCalculatorInput,
    ),
});

export const runRockPorosityCalculator = rockPorosityCalculatorTool.execute;
export default rockPorosityCalculatorTool;
