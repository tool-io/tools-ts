import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LatchupHoldingCurrentInput = {
  readonly holdingCurrentDensityMaPerUm: number;
  readonly effectiveWellWidthUm: number;
};

export type LatchupHoldingCurrentOutput = {
  readonly holdingCurrentMa: number;
};

export const latchupHoldingCurrentExample = {
  input: { effectiveWellWidthUm: 20, holdingCurrentDensityMaPerUm: 0.5 },
  output: { holdingCurrentMa: 10 },
} satisfies ToolExample<
  LatchupHoldingCurrentInput,
  LatchupHoldingCurrentOutput
>;

export const latchupHoldingCurrentTool = createSimpleTool({
  id: "semiconductor/latchup-holding-current",
  title: "Latch-Up Holding Current Calculator",
  description:
    "Compute latch-up holding current from holding current per unit width and the effective conducting well width.",
  inputs: [
    {
      description:
        "Holding current per micron of well width for the parasitic thyristor.",
      id: "holdingCurrentDensityMaPerUm",
      kind: "number",
      label: "Holding current density",
      minimum: Number.MIN_VALUE,
      unit: "mA/um",
    },
    {
      description: "Effective well width carrying the latch-up current.",
      id: "effectiveWellWidthUm",
      kind: "number",
      label: "Effective well width",
      minimum: Number.MIN_VALUE,
      unit: "um",
    },
  ],
  outputs: [
    {
      id: "holdingCurrentMa",
      kind: "number",
      label: "Holding current",
      minimum: Number.MIN_VALUE,
      unit: "mA",
    },
  ],
  calculate: (input) => {
    const holdingCurrentDensityMaPerUm =
      input.holdingCurrentDensityMaPerUm as number;
    const effectiveWellWidthUm = input.effectiveWellWidthUm as number;
    if (!(holdingCurrentDensityMaPerUm > 0))
      simpleError(
        "holdingCurrentDensityMaPerUm",
        "Holding current density must be greater than zero.",
      );
    if (!(effectiveWellWidthUm > 0))
      simpleError(
        "effectiveWellWidthUm",
        "Effective well width must be greater than zero.",
      );
    return {
      holdingCurrentMa: holdingCurrentDensityMaPerUm * effectiveWellWidthUm,
    };
  },
});
export const runLatchupHoldingCurrent = latchupHoldingCurrentTool.execute;
export default latchupHoldingCurrentTool;
