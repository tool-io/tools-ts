import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HorizonDipInput = {
  readonly heightOfEyeFeet: number;
};

export type HorizonDipOutput = {
  readonly dipMinutesOfArc: number;
};

export const DIP_MINUTES_PER_SQRT_FOOT = 0.97;

export const horizonDipExample = {
  input: { heightOfEyeFeet: 9 },
  output: { dipMinutesOfArc: 2.91 },
} satisfies ToolExample<HorizonDipInput, HorizonDipOutput>;

export const calculateHorizonDip = (
  input: HorizonDipInput,
): HorizonDipOutput => {
  if (input.heightOfEyeFeet <= 0)
    simpleError(
      "heightOfEyeFeet",
      "Height of eye must be positive.",
      "invalid_input",
    );
  return {
    dipMinutesOfArc:
      DIP_MINUTES_PER_SQRT_FOOT * Math.sqrt(input.heightOfEyeFeet),
  };
};

export const horizonDipTool = createSimpleTool({
  calculate: (input) =>
    calculateHorizonDip(input as unknown as HorizonDipInput),
  description:
    "Compute the dip of the visible horizon in minutes of arc as the coefficient zero point nine seven times the square root of height of eye in feet.",
  id: "sailing/horizon-dip",
  inputs: [
    {
      description:
        "Height of the observer's eye above the sea surface; uses the standard coefficient of zero point nine seven minutes of arc per square root foot.",
      format: "length-ft",
      id: "heightOfEyeFeet",
      kind: "number",
      label: "Height of eye",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Dip to subtract from sextant altitudes at the standard zero point nine seven coefficient.",
      id: "dipMinutesOfArc",
      kind: "number",
      label: "Dip",
      unit: "′",
    },
  ],
  title: "Horizon Dip Calculator",
});
export const runHorizonDip = horizonDipTool.execute;
export default horizonDipTool;
