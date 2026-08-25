import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BottleFillHeightCheckInput = {
  readonly measuredHeadspaceMm: number;
  readonly maxMm?: number;
  readonly minMm?: number;
};

export type BottleFillHeightCheckOutput = {
  readonly deviationMm: number;
  readonly withinRange: boolean;
};

export const bottleFillHeightCheckExample = {
  input: {
    measuredHeadspaceMm: 22,
    maxMm: 25,
    minMm: 15,
  },
  output: {
    deviationMm: 0,
    withinRange: true,
  },
} satisfies ToolExample<
  BottleFillHeightCheckInput,
  BottleFillHeightCheckOutput
>;

export const calculateBottleFillHeight = (
  input: BottleFillHeightCheckInput,
): BottleFillHeightCheckOutput => {
  const min = input.minMm ?? 15;
  const max = input.maxMm ?? 25;
  if (max < min)
    simpleError(
      "maxMm",
      "The maximum headspace cannot sit below the minimum.",
      "invalid_value",
    );
  const { measuredHeadspaceMm } = input;
  const deviation =
    measuredHeadspaceMm > max
      ? measuredHeadspaceMm - max
      : measuredHeadspaceMm < min
        ? min - measuredHeadspaceMm
        : 0;
  return {
    deviationMm: roundStatistic(deviation),
    withinRange: deviation === 0,
  };
};

export const bottleFillHeightCheckTool = createSimpleTool({
  calculate: (input) =>
    calculateBottleFillHeight(input as unknown as BottleFillHeightCheckInput),
  description:
    "Check a measured ullage against the fill height band for the bottle format in millimeters of headspace.",
  id: "oenology/bottle-fill-height-check",
  inputs: [
    {
      description: "Distance from wine surface to the closure seat.",
      id: "measuredHeadspaceMm",
      kind: "number",
      label: "Measured headspace",
      minimum: 0,
      unit: "mm",
    },
    {
      default: 25,
      description: "Largest tolerated headspace.",
      id: "maxMm",
      kind: "number",
      label: "Maximum headspace",
      minimum: 0,
      unit: "mm",
    },
    {
      default: 15,
      description: "Smallest tolerated headspace.",
      id: "minMm",
      kind: "number",
      label: "Minimum headspace",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Millimeters outside the band; zero when in range.",
      id: "deviationMm",
      kind: "number",
      label: "Deviation",
      unit: "mm",
    },
    {
      description: "Whether the fill sits inside the specified band.",
      id: "withinRange",
      kind: "boolean",
      label: "Within range",
    },
  ],
  title: "Bottle Fill Height Check",
});
export const runBottleFillHeightCheck = bottleFillHeightCheckTool.execute;
export default bottleFillHeightCheckTool;
