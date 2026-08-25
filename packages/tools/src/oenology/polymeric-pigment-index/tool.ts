import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type PolymericPigmentIndexInput = {
  readonly polymericPigmentIndex: number;
  readonly stabilityThreshold: number;
};

export type PolymericPigmentIndexOutput = {
  readonly meetsThreshold: boolean;
};

export const polymericPigmentIndexExample = {
  input: {
    polymericPigmentIndex: 0.62,
    stabilityThreshold: 0.5,
  },
  output: {
    meetsThreshold: true,
  },
} satisfies ToolExample<
  PolymericPigmentIndexInput,
  PolymericPigmentIndexOutput
>;

export const calculatePolymericPigmentIndex = (
  input: PolymericPigmentIndexInput,
): PolymericPigmentIndexOutput => {
  const threshold = input.stabilityThreshold;
  if (threshold < 0)
    simpleError(
      "stabilityThreshold",
      "The stability threshold cannot be negative.",
      "invalid_value",
    );
  return {
    meetsThreshold: roundStatistic(input.polymericPigmentIndex) >= threshold,
  };
};

export const polymericPigmentIndexTool = createSimpleTool({
  calculate: (input) =>
    calculatePolymericPigmentIndex(
      input as unknown as PolymericPigmentIndexInput,
    ),
  description:
    "Compare a polymeric-pigment assay result with a caller-selected threshold; crossing the threshold does not by itself establish long-term color stability.",
  id: "oenology/polymeric-pigment-index",
  inputs: [
    {
      description:
        "Polymeric pigment index measured by the bisulfite bleaching assay.",
      id: "polymericPigmentIndex",
      kind: "number",
      label: "PP index",
      minimum: 0,
    },
    {
      description:
        "Index at or above which the color is considered polymerized and stable.",
      id: "stabilityThreshold",
      kind: "number",
      label: "Stability threshold",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Whether the index is at or above the supplied threshold.",
      id: "meetsThreshold",
      kind: "boolean",
      label: "Meets threshold",
    },
  ],
  title: "Red Wine Polymeric Pigment Index Checker",
});
export const runPolymericPigmentIndex = polymericPigmentIndexTool.execute;
export default polymericPigmentIndexTool;
