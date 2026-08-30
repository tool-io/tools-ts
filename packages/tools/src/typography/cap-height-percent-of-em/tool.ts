import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapHeightPercentOfEmInput = Readonly<{
  readonly capHeightUnits: number;
  readonly unitsPerEm: number;
}>;
export type CapHeightPercentOfEmOutput = Readonly<{
  readonly capHeightPercent: number;
}>;

export const calculateCapHeightPercentOfEm = (
  x: CapHeightPercentOfEmInput,
): CapHeightPercentOfEmOutput => {
  if (!Number.isFinite(x.capHeightUnits) || x.capHeightUnits < 0)
    simpleError("capHeightUnits", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.unitsPerEm) || x.unitsPerEm <= 0)
    simpleError("unitsPerEm", "Provide a finite positive number.");
  if (!(x.capHeightUnits <= x.unitsPerEm))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const capHeightPercent = (100 * x.capHeightUnits) / x.unitsPerEm;
  if (!Number.isFinite(capHeightPercent))
    simpleError(
      "capHeightPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    capHeightPercent: Object.is(capHeightPercent, -0) ? 0 : capHeightPercent,
  };
};

export const example = {
  input: {
    capHeightUnits: 700,
    unitsPerEm: 1000,
  },
  output: { capHeightPercent: 70 },
} satisfies ToolExample<CapHeightPercentOfEmInput, CapHeightPercentOfEmOutput>;

export const tool = createSimpleTool({
  id: "typography/cap-height-percent-of-em",
  title: "Cap Height Percent Of Em",
  description:
    "Cap-height percentage of em from measured cap-height and units-per-em font metrics.",
  inputs: [
    {
      id: "capHeightUnits",
      kind: "number",
      label: "Cap Height Units",
      minimum: 0,
    },
    { id: "unitsPerEm", kind: "number", label: "Units Per Em", minimum: 0 },
  ],
  outputs: [
    {
      id: "capHeightPercent",
      kind: "number",
      label: "Cap Height Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateCapHeightPercentOfEm({
      capHeightUnits: input.capHeightUnits as number,
      unitsPerEm: input.unitsPerEm as number,
    }),
});
export const capHeightPercentOfEmTool = tool;
export const runCapHeightPercentOfEm = tool.execute;
export default tool;
