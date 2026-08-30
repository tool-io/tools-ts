import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ComparatorHysteresisBandInput = Readonly<{
  readonly upperVolts: number;
  readonly lowerVolts: number;
}>;
export type ComparatorHysteresisBandOutput = Readonly<{
  readonly bandVolts: number;
}>;

export const calculateComparatorHysteresisBand = (
  x: ComparatorHysteresisBandInput,
): ComparatorHysteresisBandOutput => {
  if (!Number.isFinite(x.upperVolts))
    simpleError("upperVolts", "Provide a finite number.");
  if (!Number.isFinite(x.lowerVolts))
    simpleError("lowerVolts", "Provide a finite number.");
  if (x.upperVolts < x.lowerVolts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const bandVolts = x.upperVolts - x.lowerVolts;
  if (!Number.isFinite(bandVolts))
    simpleError(
      "bandVolts",
      "Inputs produce an undefined or non-finite result.",
    );
  return { bandVolts: Object.is(bandVolts, -0) ? 0 : bandVolts };
};

export const example = {
  input: { upperVolts: 3, lowerVolts: 2 },
  output: { bandVolts: 1 },
} satisfies ToolExample<
  ComparatorHysteresisBandInput,
  ComparatorHysteresisBandOutput
>;

export const tool = createSimpleTool({
  id: "electronics/comparator-hysteresis-band",
  title: "Comparator Hysteresis Band",
  description:
    "Comparator hysteresis-band width between upper and lower switching thresholds.",
  inputs: [
    { id: "upperVolts", kind: "number", label: "Upper Volts", unit: "V" },
    { id: "lowerVolts", kind: "number", label: "Lower Volts", unit: "V" },
  ],
  outputs: [
    { id: "bandVolts", kind: "number", label: "Band Volts", unit: "V" },
  ],
  calculate: (input) =>
    calculateComparatorHysteresisBand({
      upperVolts: input.upperVolts as number,
      lowerVolts: input.lowerVolts as number,
    }),
});
export const comparatorHysteresisBandTool = tool;
export const runComparatorHysteresisBand = tool.execute;
export default tool;
