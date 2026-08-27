import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatterySocInput = {
  readonly fullCapacityAh: number;
  readonly remainingAh: number;
};

export type BatterySocOutput = {
  readonly stateOfChargePercent: number;
};

export const batterySocExample = {
  input: { fullCapacityAh: 60, remainingAh: 15 },
  output: { stateOfChargePercent: 25 },
} satisfies ToolExample<BatterySocInput, BatterySocOutput>;

export const calculateBatterySoc = (
  input: BatterySocInput,
): BatterySocOutput => {
  if (!(input.fullCapacityAh > 0))
    simpleError(
      "fullCapacityAh",
      "Full capacity must be positive.",
      "invalid_charge",
    );
  if (!(input.remainingAh >= 0) || !(input.remainingAh <= input.fullCapacityAh))
    simpleError(
      "remainingAh",
      "Remaining charge must be between zero and the full capacity.",
      "invalid_charge",
    );
  return {
    stateOfChargePercent: (input.remainingAh / input.fullCapacityAh) * 100,
  };
};

export const batterySocTool = createSimpleTool({
  calculate: (input) =>
    calculateBatterySoc(input as unknown as BatterySocInput),
  description:
    "Compute the state of charge of a battery from remaining and full capacity.",
  id: "electronics/battery-soc",
  inputs: [
    {
      description: "Charge currently stored in the battery.",
      format: "capacity",
      id: "remainingAh",
      kind: "number",
      label: "Remaining capacity",
      unit: "Ah",
    },
    {
      description: "Rated full capacity of the battery.",
      format: "capacity",
      id: "fullCapacityAh",
      kind: "number",
      label: "Full capacity",
      unit: "Ah",
    },
  ],
  outputs: [
    {
      description: "Percentage of full capacity still stored.",
      format: "percent",
      id: "stateOfChargePercent",
      kind: "number",
      label: "State of charge",
      unit: "%",
    },
  ],
  title: "State Of Charge %",
});
export const runBatterySoc = batterySocTool.execute;
export default batterySocTool;
