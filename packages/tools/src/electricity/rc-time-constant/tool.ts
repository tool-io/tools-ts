import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RcTimeConstantInput = {
  readonly resistanceOhms: number;
  readonly capacitanceFarads: number;
};

export type RcTimeConstantOutput = {
  readonly timeConstantSeconds: number;
};

export const calculateRcTimeConstant = (
  input: RcTimeConstantInput,
): RcTimeConstantOutput => {
  if (!(input.resistanceOhms > 0))
    return simpleError(
      "resistanceOhms",
      "Resistance must be positive.",
      "invalid_resistance",
    );
  if (!(input.capacitanceFarads > 0))
    return simpleError(
      "capacitanceFarads",
      "Capacitance must be positive.",
      "invalid_capacitance",
    );
  return {
    timeConstantSeconds: input.resistanceOhms * input.capacitanceFarads,
  };
};

export const rcTimeConstantExample = {
  input: {
    resistanceOhms: 10000,
    capacitanceFarads: 0.0001,
  },
  output: {
    timeConstantSeconds: 1,
  },
} satisfies ToolExample<RcTimeConstantInput, RcTimeConstantOutput>;

export const rcTimeConstantTool = createSimpleTool({
  id: "electricity/rc-time-constant",
  title: "RC Time Constant Calculator",
  description: "Compute the resistor-capacitor time constant tau = R*C.",
  inputs: [
    {
      description: "Resistance R in ohms.",
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance",
      unit: "ohm",
    },
    {
      description: "Capacitance C in farads.",
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance",
      unit: "F",
    },
  ],
  outputs: [
    {
      description: "Tau = R*C in seconds; about 63.2% charge after one tau.",
      id: "timeConstantSeconds",
      kind: "number",
      label: "Time constant",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateRcTimeConstant({
      capacitanceFarads: input.capacitanceFarads as number,
      resistanceOhms: input.resistanceOhms as number,
    }),
});

export const runRcTimeConstant = rcTimeConstantTool.execute;
export default rcTimeConstantTool;
