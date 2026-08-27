import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorTimeToCurrentInput = {
  readonly inductanceH: number;
  readonly resistanceOhms: number;
  readonly supplyVolts: number;
  readonly targetAmps: number;
};

export type InductorTimeToCurrentOutput = {
  readonly timeSeconds: number;
};

export const inductorTimeToCurrentExample = {
  input: {
    inductanceH: 0.01,
    resistanceOhms: 10,
    supplyVolts: 12,
    targetAmps: 0.6,
  },
  output: { timeSeconds: 0.0006931471805599453 },
} satisfies ToolExample<
  InductorTimeToCurrentInput,
  InductorTimeToCurrentOutput
>;

export const calculateInductorTimeToCurrent = (
  input: InductorTimeToCurrentInput,
): InductorTimeToCurrentOutput => {
  if (!(input.inductanceH > 0))
    simpleError(
      "inductanceH",
      "Inductance must be positive.",
      "invalid_inductance",
    );
  if (!(input.resistanceOhms > 0))
    simpleError(
      "resistanceOhms",
      "Resistance must be positive.",
      "invalid_resistance",
    );
  if (!(input.supplyVolts > 0))
    simpleError(
      "supplyVolts",
      "Supply voltage must be positive.",
      "invalid_supply",
    );
  if (!(input.targetAmps > 0))
    simpleError(
      "targetAmps",
      "Target current must be positive.",
      "invalid_target",
    );
  if (input.targetAmps >= input.supplyVolts / input.resistanceOhms)
    simpleError(
      "targetAmps",
      "Target current must stay below the steady-state current.",
      "unreachable_current",
    );
  return {
    timeSeconds:
      -(input.inductanceH / input.resistanceOhms) *
      Math.log(
        1 - (input.targetAmps * input.resistanceOhms) / input.supplyVolts,
      ),
  };
};

export const inductorTimeToCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateInductorTimeToCurrent(
      input as unknown as InductorTimeToCurrentInput,
    ),
  description: "Calculate RL rise time to a target current.",
  id: "electronics/inductor-time-to-current",
  inputs: [
    { id: "inductanceH", kind: "number", label: "Inductance", unit: "H" },
    { id: "resistanceOhms", kind: "number", label: "Resistance", unit: "ohm" },
    { id: "supplyVolts", kind: "number", label: "Supply voltage", unit: "V" },
    { id: "targetAmps", kind: "number", label: "Target current", unit: "A" },
  ],
  outputs: [{ id: "timeSeconds", kind: "number", label: "Time", unit: "s" }],
  title: "RL Time To Current",
});
export const runInductorTimeToCurrent = inductorTimeToCurrentTool.execute;
export default inductorTimeToCurrentTool;
