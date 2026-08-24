import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MemristorOnOffRatioInput = {
  readonly offResistanceOhms: number;
  readonly onResistanceOhms: number;
};

export type MemristorOnOffRatioOutput = {
  readonly onOffRatio: number;
};

export const memristorOnOffRatioExample = {
  input: { offResistanceOhms: 100000, onResistanceOhms: 1000 },
  output: { onOffRatio: 100 },
} satisfies ToolExample<MemristorOnOffRatioInput, MemristorOnOffRatioOutput>;

export const memristorOnOffRatioTool = createSimpleTool({
  id: "semiconductor/memristor-on-off-ratio",
  title: "Memristor On-Off Ratio Calculator",
  description:
    "Compute the memristor resistance ratio between the high-resistance off state and low-resistance on state.",
  inputs: [
    {
      description: "Low-resistance state resistance.",
      id: "onResistanceOhms",
      kind: "number",
      label: "On resistance",
      minimum: Number.MIN_VALUE,
      unit: "\u03A9",
    },
    {
      description: "High-resistance state resistance.",
      id: "offResistanceOhms",
      kind: "number",
      label: "Off resistance",
      minimum: Number.MIN_VALUE,
      unit: "\u03A9",
    },
  ],
  outputs: [
    {
      description:
        "High-resistance off state divided by low-resistance on state.",
      format: "ratio",
      id: "onOffRatio",
      kind: "number",
      label: "On-off ratio",
      minimum: 1,
    },
  ],
  calculate: (input) => {
    const onResistanceOhms = input.onResistanceOhms as number;
    if (!(onResistanceOhms > 0))
      simpleError(
        "onResistanceOhms",
        "On resistance must be greater than zero.",
      );
    if (!((input.offResistanceOhms as number) > 0))
      simpleError(
        "offResistanceOhms",
        "Off resistance must be greater than zero.",
      );
    if ((input.offResistanceOhms as number) < onResistanceOhms)
      simpleError(
        "offResistanceOhms",
        "Off resistance must be at least the on resistance.",
      );
    return {
      onOffRatio: (input.offResistanceOhms as number) / onResistanceOhms,
    };
  },
});
export const runMemristorOnOffRatio = memristorOnOffRatioTool.execute;
export default memristorOnOffRatioTool;
