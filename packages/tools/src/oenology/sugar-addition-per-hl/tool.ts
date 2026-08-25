import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type SugarAdditionPerHlInput = {
  readonly currentBrix: number;
  readonly targetBrix: number;
};

export type SugarAdditionPerHlOutput = {
  readonly kilogramsPerHectoliter: number;
};

export const sugarAdditionPerHlExample = {
  input: {
    currentBrix: 18,
    targetBrix: 22,
  },
  output: {
    kilogramsPerHectoliter: 4,
  },
} satisfies ToolExample<SugarAdditionPerHlInput, SugarAdditionPerHlOutput>;

export const calculateSugarAdditionPerHl = (
  input: SugarAdditionPerHlInput,
): SugarAdditionPerHlOutput => {
  if (input.targetBrix < input.currentBrix)
    simpleError(
      "targetBrix",
      "The target Brix must be at or above the current Brix to dose sugar.",
      "invalid_target",
    );
  return {
    kilogramsPerHectoliter: roundStatistic(
      input.targetBrix - input.currentBrix,
    ),
  };
};

export const sugarAdditionPerHlTool = createSimpleTool({
  calculate: (input) =>
    calculateSugarAdditionPerHl(input as unknown as SugarAdditionPerHlInput),
  description:
    "Express a Brix adjustment as cane sugar kilograms per hectoliter of must.",
  id: "oenology/sugar-addition-per-hl",
  inputs: [
    {
      description: "Measured dissolved sugar in degrees Brix.",
      id: "currentBrix",
      kind: "number",
      label: "Current Brix",
      minimum: 0,
    },
    {
      description: "Target dissolved sugar in degrees Brix.",
      id: "targetBrix",
      kind: "number",
      label: "Target Brix",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Cane sugar per hectoliter of must.",
      id: "kilogramsPerHectoliter",
      kind: "number",
      label: "Kilograms per hL",
      unit: "kg/hL",
    },
  ],
  title: "Sugar Addition kg per hL Calculator",
});
export const runSugarAdditionPerHl = sugarAdditionPerHlTool.execute;
export default sugarAdditionPerHlTool;
