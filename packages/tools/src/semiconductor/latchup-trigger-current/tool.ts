import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LatchupTriggerCurrentInput = {
  readonly triggerCurrentDensityMaPerUm: number;
  readonly effectiveWellWidthUm: number;
};

export type LatchupTriggerCurrentOutput = {
  readonly triggerCurrentMa: number;
};

export const latchupTriggerCurrentExample = {
  input: { effectiveWellWidthUm: 15, triggerCurrentDensityMaPerUm: 0.2 },
  output: { triggerCurrentMa: 3 },
} satisfies ToolExample<
  LatchupTriggerCurrentInput,
  LatchupTriggerCurrentOutput
>;

export const latchupTriggerCurrentTool = createSimpleTool({
  id: "semiconductor/latchup-trigger-current",
  title: "Latch-Up Trigger Current Calculator",
  description:
    "Compute latch-up trigger current from trigger current per unit width and the effective conducting well width.",
  inputs: [
    {
      description:
        "Trigger current per micron of well width for the parasitic thyristor.",
      id: "triggerCurrentDensityMaPerUm",
      kind: "number",
      label: "Trigger current density",
      minimum: Number.MIN_VALUE,
      unit: "mA/um",
    },
    {
      description: "Effective well width carrying the trigger current.",
      id: "effectiveWellWidthUm",
      kind: "number",
      label: "Effective well width",
      minimum: Number.MIN_VALUE,
      unit: "um",
    },
  ],
  outputs: [
    {
      id: "triggerCurrentMa",
      kind: "number",
      label: "Trigger current",
      minimum: Number.MIN_VALUE,
      unit: "mA",
    },
  ],
  calculate: (input) => {
    const triggerCurrentDensityMaPerUm =
      input.triggerCurrentDensityMaPerUm as number;
    const effectiveWellWidthUm = input.effectiveWellWidthUm as number;
    if (!(triggerCurrentDensityMaPerUm > 0))
      simpleError(
        "triggerCurrentDensityMaPerUm",
        "Trigger current density must be greater than zero.",
      );
    if (!(effectiveWellWidthUm > 0))
      simpleError(
        "effectiveWellWidthUm",
        "Effective well width must be greater than zero.",
      );
    return {
      triggerCurrentMa: triggerCurrentDensityMaPerUm * effectiveWellWidthUm,
    };
  },
});
export const runLatchupTriggerCurrent = latchupTriggerCurrentTool.execute;
export default latchupTriggerCurrentTool;
