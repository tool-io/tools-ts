import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BankAngleFromLoadInput = {
  readonly loadFactorG: number;
};

export type BankAngleFromLoadOutput = {
  readonly bankAngleDeg: number;
};

export const bankAngleFromLoadExample = {
  input: { loadFactorG: 2 },
  output: { bankAngleDeg: 60 },
} satisfies ToolExample<BankAngleFromLoadInput, BankAngleFromLoadOutput>;

export const calculateBankAngleFromLoad = (
  input: BankAngleFromLoadInput,
): BankAngleFromLoadOutput => {
  if (input.loadFactorG < 1)
    simpleError(
      "loadFactorG",
      "A coordinated level turn needs a load factor of one or more.",
      "invalid_load_factor",
    );
  return {
    bankAngleDeg: roundStatistic(
      (Math.acos(1 / input.loadFactorG) * 180) / Math.PI,
    ),
  };
};

export const bankAngleFromLoadTool = createSimpleTool({
  calculate: (input) =>
    calculateBankAngleFromLoad(input as unknown as BankAngleFromLoadInput),
  description:
    "Compute the bank angle that produces a given load factor in a coordinated level turn.",
  id: "aviation/bank-angle-from-load",
  inputs: [
    {
      description:
        "Load factor in g; must be at least one for a real bank angle.",
      id: "loadFactorG",
      kind: "number",
      label: "Load factor",
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Bank angle of the coordinated level turn.",
      format: "angle",
      id: "bankAngleDeg",
      kind: "number",
      label: "Bank angle",
      unit: "°",
    },
  ],
  title: "Bank Angle From Load Factor Calculator",
});
export const runBankAngleFromLoad = bankAngleFromLoadTool.execute;
export default bankAngleFromLoadTool;
