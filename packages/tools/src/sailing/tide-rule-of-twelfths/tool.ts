import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TideRuleOfTwelfthsInput = {
  readonly hourIntoTide: number;
  readonly tidalRangeMeters: number;
};

export type TideRuleOfTwelfthsOutput = {
  readonly heightChangeMeters: number;
};

const TWELFTHS_PER_HOUR = [1, 2, 3, 3, 2, 1];

export const tideRuleOfTwelfthsExample = {
  input: { hourIntoTide: 2, tidalRangeMeters: 3 },
  output: { heightChangeMeters: 0.5 },
} satisfies ToolExample<TideRuleOfTwelfthsInput, TideRuleOfTwelfthsOutput>;

export const calculateTideRuleOfTwelfths = (
  input: TideRuleOfTwelfthsInput,
): TideRuleOfTwelfthsOutput => {
  if (input.tidalRangeMeters <= 0)
    simpleError(
      "tidalRangeMeters",
      "Tidal range must be positive.",
      "invalid_input",
    );
  if (!(
    Number.isSafeInteger(input.hourIntoTide) &&
    input.hourIntoTide >= 1 &&
    input.hourIntoTide <= 6
  ))
    simpleError(
      "hourIntoTide",
      "The tidal hour must be an integer from one through six.",
      "invalid_hour",
    );
  return {
    heightChangeMeters:
      (input.tidalRangeMeters * TWELFTHS_PER_HOUR[input.hourIntoTide - 1]!) /
      12,
  };
};

export const tideRuleOfTwelfthsTool = createSimpleTool({
  calculate: (input) =>
    calculateTideRuleOfTwelfths(input as unknown as TideRuleOfTwelfthsInput),
  description:
    "Compute the water level change for one hour of a tide using the rule of twelfths over a six hour half cycle.",
  id: "sailing/tide-rule-of-twelfths",
  inputs: [
    {
      description:
        "Tidal hour being evaluated, from the first through sixth hour after slack water.",
      id: "hourIntoTide",
      kind: "integer",
      label: "Hour into tide",
      maximum: 6,
      minimum: 1,
    },
    {
      description: "Total tidal range between low and high water.",
      id: "tidalRangeMeters",
      kind: "number",
      label: "Tidal range",
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Water level change during that hour; positive toward high water.",
      format: "length-m",
      id: "heightChangeMeters",
      kind: "number",
      label: "Height change",
      unit: "m",
    },
  ],
  title: "Tide Rule of Twelfths Calculator",
});
export const runTideRuleOfTwelfths = tideRuleOfTwelfthsTool.execute;
export default tideRuleOfTwelfthsTool;
