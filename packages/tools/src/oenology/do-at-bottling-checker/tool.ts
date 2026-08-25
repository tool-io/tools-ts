import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type DoAtBottlingCheckerInput = {
  readonly dissolvedOxygenMgPerL: number;
  readonly limitMgPerL: number;
};

export type DoAtBottlingCheckerOutput = {
  readonly excessMgPerL: number;
  readonly withinLimit: boolean;
};

export const doAtBottlingCheckerExample = {
  input: {
    dissolvedOxygenMgPerL: 0.4,
    limitMgPerL: 0.5,
  },
  output: {
    excessMgPerL: 0,
    withinLimit: true,
  },
} satisfies ToolExample<DoAtBottlingCheckerInput, DoAtBottlingCheckerOutput>;

export const calculateDoAtBottling = (
  input: DoAtBottlingCheckerInput,
): DoAtBottlingCheckerOutput => {
  const limit = input.limitMgPerL;
  const excess = Math.max(0, input.dissolvedOxygenMgPerL - limit);
  if (limit <= 0)
    simpleError(
      "limitMgPerL",
      "The dissolved oxygen limit must be positive.",
      "invalid_value",
    );
  return {
    excessMgPerL: roundStatistic(excess),
    withinLimit: excess === 0,
  };
};

export const doAtBottlingCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateDoAtBottling(input as unknown as DoAtBottlingCheckerInput),
  description:
    "Compare the filler dissolved oxygen reading against the cellar's bottling specification.",
  id: "oenology/do-at-bottling-checker",
  inputs: [
    {
      description: "Dissolved oxygen measured at the filler bowl.",
      id: "dissolvedOxygenMgPerL",
      kind: "number",
      label: "Dissolved oxygen",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Maximum dissolved oxygen under the bottling specification.",
      id: "limitMgPerL",
      kind: "number",
      label: "Limit",
      minimum: 0,
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      description: "Amount above the limit, if any.",
      id: "excessMgPerL",
      kind: "number",
      label: "Excess",
      unit: "mg/L",
    },
    {
      description: "Whether the reading meets the specification.",
      id: "withinLimit",
      kind: "boolean",
      label: "Within limit",
    },
  ],
  title: "Dissolved Oxygen at Bottling Checker",
});
export const runDoAtBottlingChecker = doAtBottlingCheckerTool.execute;
export default doAtBottlingCheckerTool;
