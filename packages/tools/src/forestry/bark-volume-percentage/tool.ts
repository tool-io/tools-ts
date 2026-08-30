import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BarkVolumePercentageInput = Readonly<{
  readonly overBarkDiameterCentimeters: number;
  readonly underBarkDiameterCentimeters: number;
}>;
export type BarkVolumePercentageOutput = Readonly<{
  readonly barkVolumePercent: number;
}>;

export const calculateBarkVolumePercentage = (
  x: BarkVolumePercentageInput,
): BarkVolumePercentageOutput => {
  if (
    !Number.isFinite(x.overBarkDiameterCentimeters) ||
    x.overBarkDiameterCentimeters <= 0
  )
    simpleError(
      "overBarkDiameterCentimeters",
      "Provide a finite positive number.",
    );
  if (
    !Number.isFinite(x.underBarkDiameterCentimeters) ||
    x.underBarkDiameterCentimeters < 0
  )
    simpleError(
      "underBarkDiameterCentimeters",
      "Provide a finite nonnegative number.",
    );
  if (!(x.underBarkDiameterCentimeters <= x.overBarkDiameterCentimeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const barkVolumePercent =
    100 *
    (1 - (x.underBarkDiameterCentimeters / x.overBarkDiameterCentimeters) ** 2);
  if (!Number.isFinite(barkVolumePercent))
    simpleError(
      "barkVolumePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    barkVolumePercent: Object.is(barkVolumePercent, -0) ? 0 : barkVolumePercent,
  };
};

export const example = {
  input: {
    overBarkDiameterCentimeters: 20,
    underBarkDiameterCentimeters: 18,
  },
  output: { barkVolumePercent: 18.999999999999993 },
} satisfies ToolExample<BarkVolumePercentageInput, BarkVolumePercentageOutput>;

export const tool = createSimpleTool({
  id: "forestry/bark-volume-percentage",
  title: "Bark Volume Percentage",
  description:
    "Approximate bark volume percentage from squared over- and under-bark diameter ratio, assuming identical taper.",
  inputs: [
    {
      id: "overBarkDiameterCentimeters",
      kind: "number",
      label: "Over Bark Diameter Centimeters",
      unit: "cm",
      minimum: 0,
    },
    {
      id: "underBarkDiameterCentimeters",
      kind: "number",
      label: "Under Bark Diameter Centimeters",
      unit: "cm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "barkVolumePercent",
      kind: "number",
      label: "Bark Volume Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateBarkVolumePercentage({
      overBarkDiameterCentimeters: input.overBarkDiameterCentimeters as number,
      underBarkDiameterCentimeters:
        input.underBarkDiameterCentimeters as number,
    }),
});
export const barkVolumePercentageTool = tool;
export const runBarkVolumePercentage = tool.execute;
export default tool;
