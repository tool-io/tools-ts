import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResistivePowerLossInput = Readonly<{
  readonly currentAmperes: number;
  readonly resistanceOhms: number;
}>;
export type ResistivePowerLossOutput = Readonly<{
  readonly lossWatts: number;
}>;

export const calculateResistivePowerLoss = (
  x: ResistivePowerLossInput,
): ResistivePowerLossOutput => {
  if (!Number.isFinite(x.currentAmperes) || x.currentAmperes < 0)
    simpleError("currentAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.resistanceOhms) || x.resistanceOhms < 0)
    simpleError("resistanceOhms", "Provide a finite number at least 0.");
  const lossWatts = x.currentAmperes ** 2 * x.resistanceOhms;
  if (!Number.isFinite(lossWatts))
    simpleError(
      "lossWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lossWatts: Object.is(lossWatts, -0) ? 0 : lossWatts };
};

export const example = {
  input: { currentAmperes: 10, resistanceOhms: 0.5 },
  output: { lossWatts: 50 },
} satisfies ToolExample<ResistivePowerLossInput, ResistivePowerLossOutput>;

export const tool = createSimpleTool({
  id: "engineering/resistive-power-loss",
  title: "Resistive Power Loss",
  description:
    "Resistive heat dissipation I²R in a conductor or load at specified RMS current.",
  inputs: [
    {
      id: "currentAmperes",
      kind: "number",
      label: "Current Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lossWatts", kind: "number", label: "Loss Watts", unit: "W" },
  ],
  calculate: (input) =>
    calculateResistivePowerLoss({
      currentAmperes: input.currentAmperes as number,
      resistanceOhms: input.resistanceOhms as number,
    }),
});
export const resistivePowerLossTool = tool;
export const runResistivePowerLoss = tool.execute;
export default tool;
