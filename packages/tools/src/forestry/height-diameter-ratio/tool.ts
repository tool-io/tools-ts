import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeightDiameterRatioInput = Readonly<{
  readonly treeHeightMeters: number;
  readonly dbhCentimeters: number;
}>;
export type HeightDiameterRatioOutput = Readonly<{
  readonly heightToDiameterRatio: number;
}>;

export const calculateHeightDiameterRatio = (
  x: HeightDiameterRatioInput,
): HeightDiameterRatioOutput => {
  if (!Number.isFinite(x.treeHeightMeters) || x.treeHeightMeters <= 0)
    simpleError("treeHeightMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.dbhCentimeters) || x.dbhCentimeters <= 0)
    simpleError("dbhCentimeters", "Provide a finite positive number.");
  const heightToDiameterRatio = (100 * x.treeHeightMeters) / x.dbhCentimeters;
  if (!Number.isFinite(heightToDiameterRatio))
    simpleError(
      "heightToDiameterRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    heightToDiameterRatio: Object.is(heightToDiameterRatio, -0)
      ? 0
      : heightToDiameterRatio,
  };
};

export const example = {
  input: {
    treeHeightMeters: 20,
    dbhCentimeters: 20,
  },
  output: { heightToDiameterRatio: 100 },
} satisfies ToolExample<HeightDiameterRatioInput, HeightDiameterRatioOutput>;

export const tool = createSimpleTool({
  id: "forestry/height-diameter-ratio",
  title: "Height Diameter Ratio",
  description:
    "Dimensionless tree slenderness from height in metres divided by DBH converted from centimetres to metres.",
  inputs: [
    {
      id: "treeHeightMeters",
      kind: "number",
      label: "Tree Height Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "dbhCentimeters",
      kind: "number",
      label: "Dbh Centimeters",
      unit: "cm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "heightToDiameterRatio",
      kind: "number",
      label: "Height To Diameter Ratio",
    },
  ],
  calculate: (input) =>
    calculateHeightDiameterRatio({
      treeHeightMeters: input.treeHeightMeters as number,
      dbhCentimeters: input.dbhCentimeters as number,
    }),
});
export const heightDiameterRatioTool = tool;
export const runHeightDiameterRatio = tool.execute;
export default tool;
