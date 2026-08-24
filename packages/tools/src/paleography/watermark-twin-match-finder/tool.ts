import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WatermarkTwinMatchFinderInput = {
  readonly chainSpacingOneMm: number;
  readonly laidSpacingOneMm: number;
  readonly chainSpacingTwoMm: number;
  readonly laidSpacingTwoMm: number;
  readonly toleranceMm?: number;
};

export type WatermarkTwinMatchFinderOutput = {
  readonly chainlineDeltaMm: number;
  readonly laidLineDeltaMm: number;
  readonly isProbableTwin: boolean;
};

export const calculateWatermarkTwinMatchFinder = (
  input: WatermarkTwinMatchFinderInput,
): WatermarkTwinMatchFinderOutput => {
  for (const key of [
    "chainSpacingOneMm",
    "laidSpacingOneMm",
    "chainSpacingTwoMm",
    "laidSpacingTwoMm",
  ] as const) {
    if (!(Number.isFinite(input[key]) && input[key] > 0))
      return simpleError(
        key,
        "Spacings must be greater than zero.",
        "invalid_measurement",
      );
  }
  const toleranceMm = input.toleranceMm ?? 1;
  if (!(Number.isFinite(toleranceMm) && toleranceMm >= 0))
    return simpleError(
      "toleranceMm",
      "Tolerance must be non-negative.",
      "invalid_tolerance",
    );
  const chainlineDeltaMm = input.chainSpacingOneMm - input.chainSpacingTwoMm;
  const laidLineDeltaMm = input.laidSpacingOneMm - input.laidSpacingTwoMm;
  return {
    chainlineDeltaMm,
    laidLineDeltaMm,
    isProbableTwin:
      Math.abs(chainlineDeltaMm) <= toleranceMm &&
      Math.abs(laidLineDeltaMm) <= toleranceMm,
  };
};

export const watermarkTwinMatchFinderExample = {
  input: {
    chainSpacingOneMm: 27,
    laidSpacingOneMm: 2.4,
    chainSpacingTwoMm: 27.5,
    laidSpacingTwoMm: 2.3,
  },
  output: {
    chainlineDeltaMm: -0.5,
    laidLineDeltaMm: 0.10000000000000009,
    isProbableTwin: true,
  },
} satisfies ToolExample<
  WatermarkTwinMatchFinderInput,
  WatermarkTwinMatchFinderOutput
>;

export const watermarkTwinMatchFinderTool = createSimpleTool({
  id: "paleography/watermark-twin-match-finder",
  title: "Watermark Twin Match Finder",
  description:
    "Compare measured chain-line and laid-line spacings of two sheets and declare a probable twin (same paper stock) when both signed deltas fall within the stated default tolerance of one millimetre.",
  inputs: [
    {
      description: "Chain-line spacing of sheet one in millimetres.",
      id: "chainSpacingOneMm",
      kind: "number",
      label: "Chain #1",
      minimum: 0,
    },
    {
      description: "Laid-line spacing of sheet one in millimetres.",
      id: "laidSpacingOneMm",
      kind: "number",
      label: "Laid #1",
      minimum: 0,
    },
    {
      description: "Chain-line spacing of sheet two in millimetres.",
      id: "chainSpacingTwoMm",
      kind: "number",
      label: "Chain #2",
      minimum: 0,
    },
    {
      description: "Laid-line spacing of sheet two in millimetres.",
      id: "laidSpacingTwoMm",
      kind: "number",
      label: "Laid #2",
      minimum: 0,
    },
    {
      default: 1,
      description: "Allowed delta per spacing in millimetres.",
      id: "toleranceMm",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Signed chain-spacing difference (one minus two).",
      id: "chainlineDeltaMm",
      kind: "number",
      label: "Chain delta",
    },
    {
      description: "Signed laid-spacing difference (one minus two).",
      id: "laidLineDeltaMm",
      kind: "number",
      label: "Laid delta",
    },
    {
      description: "True when both deltas sit within tolerance.",
      id: "isProbableTwin",
      kind: "boolean",
      label: "Probable twin",
    },
  ],
  calculate: (input) =>
    calculateWatermarkTwinMatchFinder({
      chainSpacingOneMm: input.chainSpacingOneMm as number,
      laidSpacingOneMm: input.laidSpacingOneMm as number,
      chainSpacingTwoMm: input.chainSpacingTwoMm as number,
      laidSpacingTwoMm: input.laidSpacingTwoMm as number,
      toleranceMm: input.toleranceMm as number,
    }),
});

export const runWatermarkTwinMatchFinder = watermarkTwinMatchFinderTool.execute;
export default watermarkTwinMatchFinderTool;
