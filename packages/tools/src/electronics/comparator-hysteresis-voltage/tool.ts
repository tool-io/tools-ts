import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const comparatorHysteresisVoltageExample = {
  input: {
    feedbackResistorOhms: 100000,
    referenceResistorOhms: 25000,
    outputSwingVolts: 2,
  },
  output: { hysteresisWidthV: 0.4 },
} satisfies ToolExample<
  {
    readonly feedbackResistorOhms: number;
    readonly referenceResistorOhms: number;
    readonly outputSwingVolts: number;
  },
  { readonly hysteresisWidthV: number }
>;

export const comparatorHysteresisVoltageTool = createSimpleTool({
  id: "electronics/comparator-hysteresis-voltage",
  title: "Comparator Hysteresis Width",
  description:
    "Compute comparator hysteresis from the output swing and the positive-feedback divider: width = output swing x Rreference / (Rfeedback + Rreference).",
  inputs: [
    {
      id: "feedbackResistorOhms",
      kind: "number",
      label: "Feedback R",
      unit: "Ω",
    },
    {
      id: "referenceResistorOhms",
      kind: "number",
      label: "Input R",
      unit: "Ω",
    },
    {
      id: "outputSwingVolts",
      kind: "number",
      label: "Output swing",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "hysteresisWidthV",
      kind: "number",
      label: "Hysteresis width",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const rf = input.feedbackResistorOhms as number;
    const rin = input.referenceResistorOhms as number;
    if (rf <= 0 || rin <= 0)
      simpleError(
        "feedbackResistorOhms",
        "Both resistances must be greater than zero.",
        "invalid_resistance",
      );
    const outputSwing = input.outputSwingVolts as number;
    if (outputSwing <= 0)
      simpleError(
        "outputSwingVolts",
        "The output swing must be greater than zero.",
        "invalid_voltage",
      );
    return { hysteresisWidthV: outputSwing * (rin / (rf + rin)) };
  },
});
export const runComparatorHysteresisVoltage =
  comparatorHysteresisVoltageTool.execute;
export default comparatorHysteresisVoltageTool;
