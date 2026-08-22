import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CgPercentMacInput = {
  readonly cgAftOfDatumIn: number;
  readonly lemacAftOfDatumIn: number;
  readonly macInches: number;
};

export type CgPercentMacOutput = {
  readonly percentMac: number;
};

export const cgPercentMacExample = {
  input: { cgAftOfDatumIn: 40, lemacAftOfDatumIn: 34, macInches: 60 },
  output: { percentMac: 10 },
} satisfies ToolExample<CgPercentMacInput, CgPercentMacOutput>;

export const calculateCgPercentMac = (
  input: CgPercentMacInput,
): CgPercentMacOutput => {
  if (input.macInches <= 0)
    simpleError(
      "macInches",
      "The mean aerodynamic chord must be positive.",
      "invalid_mac",
    );
  return {
    percentMac:
      ((input.cgAftOfDatumIn - input.lemacAftOfDatumIn) / input.macInches) *
      100,
  };
};

export const cgPercentMacTool = createSimpleTool({
  calculate: (input) =>
    calculateCgPercentMac(input as unknown as CgPercentMacInput),
  description:
    "Express the center-of-gravity position as a percentage of the mean aerodynamic chord.",
  id: "aviation/cg-percent-mac",
  inputs: [
    {
      description: "Center of gravity position aft of the datum.",
      id: "cgAftOfDatumIn",
      kind: "number",
      label: "CG position",
      unit: "in",
    },
    {
      description: "Leading edge of the MAC, aft of the same datum.",
      id: "lemacAftOfDatumIn",
      kind: "number",
      label: "LEMAC position",
      unit: "in",
    },
    {
      description: "Length of the mean aerodynamic chord.",
      id: "macInches",
      kind: "number",
      label: "MAC length",
      unit: "in",
    },
  ],
  outputs: [
    {
      description: "CG position as percent of the MAC.",
      format: "percent",
      id: "percentMac",
      kind: "number",
      label: "% MAC",
      unit: "%",
    },
  ],
  title: "CG Percent MAC Calculator",
});
export const runCgPercentMac = cgPercentMacTool.execute;
export default cgPercentMacTool;
