import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type TreadDepthCheckInput = {
  readonly treadDepthCm: number;
};

export type TreadDepthCheckOutput = {
  readonly deviationFromIdealCm: number;
  readonly isIdealTread: boolean;
};

export const treadDepthCheckExample = {
  input: { treadDepthCm: 29 },
  output: { deviationFromIdealCm: 0, isIdealTread: true },
} satisfies ToolExample<TreadDepthCheckInput, TreadDepthCheckOutput>;

export const treadDepthCheckTool = createSimpleTool({
  id: "carpentry/treppen-auftritt-28-29-ideal",
  title: "Tread Depth Check",
  description:
    "Check whether a stair tread depth falls in the ideal 28 to 29 cm range and report its deviation in centimeters.",
  inputs: [
    {
      description: "Tread depth in centimeters.",
      id: "treadDepthCm",
      kind: "number",
      label: "Tread depth",
      maximum: 35,
      minimum: 20,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description:
        "True when the tread depth is between 28 and 29 cm inclusive.",
      id: "isIdealTread",
      kind: "boolean",
      label: "Is ideal tread",
    },
    {
      description:
        "Deviation from the ideal 28 to 29 cm range in centimeters, zero inside the range.",
      id: "deviationFromIdealCm",
      kind: "number",
      label: "Deviation from ideal",
      unit: "cm",
    },
  ],
  calculate: (input) => {
    const treadDepthCm = input.treadDepthCm as number;
    return {
      deviationFromIdealCm: Math.max(0, 28 - treadDepthCm, treadDepthCm - 29),
      isIdealTread: treadDepthCm >= 28 && treadDepthCm <= 29,
    };
  },
});
export const runTreadDepthCheck = treadDepthCheckTool.execute;
export default treadDepthCheckTool;
