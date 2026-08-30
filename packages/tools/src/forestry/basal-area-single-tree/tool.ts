import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BasalAreaSingleTreeInput = Readonly<{
  readonly dbhCentimeters: number;
}>;
export type BasalAreaSingleTreeOutput = Readonly<{
  readonly basalSquareMeters: number;
}>;

export const calculateBasalAreaSingleTree = (
  x: BasalAreaSingleTreeInput,
): BasalAreaSingleTreeOutput => {
  if (!Number.isFinite(x.dbhCentimeters) || x.dbhCentimeters <= 0)
    simpleError("dbhCentimeters", "Provide a finite positive number.");
  const basalSquareMeters = Math.PI * (x.dbhCentimeters / 200) ** 2;
  if (!Number.isFinite(basalSquareMeters))
    simpleError(
      "basalSquareMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    basalSquareMeters: Object.is(basalSquareMeters, -0) ? 0 : basalSquareMeters,
  };
};

export const example = {
  input: {
    dbhCentimeters: 20,
  },
  output: { basalSquareMeters: 0.031415926535897934 },
} satisfies ToolExample<BasalAreaSingleTreeInput, BasalAreaSingleTreeOutput>;

export const tool = createSimpleTool({
  id: "forestry/basal-area-single-tree",
  title: "Basal Area Single Tree",
  description:
    "Tree stem cross-sectional basal area at breast height in square metres from DBH in centimetres.",
  inputs: [
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
      id: "basalSquareMeters",
      kind: "number",
      label: "Basal Square Meters",
      unit: "m2",
    },
  ],
  calculate: (input) =>
    calculateBasalAreaSingleTree({
      dbhCentimeters: input.dbhCentimeters as number,
    }),
});
export const basalAreaSingleTreeTool = tool;
export const runBasalAreaSingleTree = tool.execute;
export default tool;
