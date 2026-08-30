import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StandDensityIndexReinekeInput = Readonly<{
  readonly treesPerHectare: number;
  readonly quadraticMeanDbhCentimeters: number;
}>;
export type StandDensityIndexReinekeOutput = Readonly<{
  readonly standDensityIndex: number;
}>;

export const calculateStandDensityIndexReineke = (
  x: StandDensityIndexReinekeInput,
): StandDensityIndexReinekeOutput => {
  if (!Number.isFinite(x.treesPerHectare) || x.treesPerHectare < 0)
    simpleError("treesPerHectare", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.quadraticMeanDbhCentimeters) ||
    x.quadraticMeanDbhCentimeters <= 0
  )
    simpleError(
      "quadraticMeanDbhCentimeters",
      "Provide a finite positive number.",
    );
  const standDensityIndex =
    x.treesPerHectare * (x.quadraticMeanDbhCentimeters / 25.4) ** 1.605;
  if (!Number.isFinite(standDensityIndex))
    simpleError(
      "standDensityIndex",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    standDensityIndex: Object.is(standDensityIndex, -0) ? 0 : standDensityIndex,
  };
};

export const example = {
  input: {
    treesPerHectare: 500,
    quadraticMeanDbhCentimeters: 25.4,
  },
  output: { standDensityIndex: 500 },
} satisfies ToolExample<
  StandDensityIndexReinekeInput,
  StandDensityIndexReinekeOutput
>;

export const tool = createSimpleTool({
  id: "forestry/stand-density-index-reineke",
  title: "Stand Density Index Reineke",
  description:
    "Reineke stand density index using 25.4 cm reference DBH and 1.605 exponent.",
  inputs: [
    {
      id: "treesPerHectare",
      kind: "number",
      label: "Trees Per Hectare",
      unit: "1/ha",
      minimum: 0,
    },
    {
      id: "quadraticMeanDbhCentimeters",
      kind: "number",
      label: "Quadratic Mean Dbh Centimeters",
      unit: "cm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "standDensityIndex",
      kind: "number",
      label: "Stand Density Index",
      unit: "1/ha",
    },
  ],
  calculate: (input) =>
    calculateStandDensityIndexReineke({
      treesPerHectare: input.treesPerHectare as number,
      quadraticMeanDbhCentimeters: input.quadraticMeanDbhCentimeters as number,
    }),
});
export const standDensityIndexReinekeTool = tool;
export const runStandDensityIndexReineke = tool.execute;
export default tool;
