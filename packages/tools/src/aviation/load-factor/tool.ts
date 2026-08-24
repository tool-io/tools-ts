import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type LoadFactorInput = {
  readonly bankAngleDeg: number;
};

export type LoadFactorOutput = {
  readonly loadFactorG: number;
};

export const loadFactorExample = {
  input: { bankAngleDeg: 60 },
  output: { loadFactorG: 2 },
} satisfies ToolExample<LoadFactorInput, LoadFactorOutput>;

export const calculateLoadFactor = (
  input: LoadFactorInput,
): LoadFactorOutput => {
  if (
    !Number.isFinite(input.bankAngleDeg) ||
    Math.abs(input.bankAngleDeg) >= 90
  )
    simpleError(
      "bankAngleDeg",
      "The bank angle must be greater than -90 degrees and less than 90 degrees.",
      "invalid_bank_angle",
    );
  const radians = (input.bankAngleDeg * Math.PI) / 180;
  return { loadFactorG: roundStatistic(1 / Math.cos(radians)) };
};

export const loadFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateLoadFactor({ bankAngleDeg: input.bankAngleDeg as number }),
  description: "Compute the load factor in a level turn from the bank angle.",
  id: "aviation/load-factor",
  inputs: [
    {
      description: "Bank angle of a coordinated level turn.",
      id: "bankAngleDeg",
      kind: "number",
      label: "Bank angle",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Load factor as a multiple of weight.",
      format: "g-load",
      id: "loadFactorG",
      kind: "number",
      label: "Load factor",
    },
  ],
  title: "Load Factor Calculator",
});
export const runLoadFactor = loadFactorTool.execute;
export default loadFactorTool;
