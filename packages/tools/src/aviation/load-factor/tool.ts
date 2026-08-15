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
  const radians = (input.bankAngleDeg * Math.PI) / 180;
  const cosine = Math.cos(radians);
  if (Math.abs(cosine) < 1e-12)
    simpleError(
      "bankAngleDeg",
      "Load factor is undefined at a ninety degree bank.",
      "undefined_load_factor",
    );
  return { loadFactorG: roundStatistic(1 / cosine) };
};

export const loadFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateLoadFactor(input as unknown as LoadFactorInput),
  description:
    "Compute the load factor in a level turn from the bank angle.",
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
