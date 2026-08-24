import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrimLossEdgeRecorderInput = {
  readonly originalSheetWidthMm: number;
  readonly originalSheetHeightMm: number;
  readonly trimmedPageWidthMm: number;
  readonly trimmedPageHeightMm: number;
};

export type TrimLossEdgeRecorderOutput = {
  readonly lossWidthMm: number;
  readonly lossHeightMm: number;
  readonly lostAreaSquareCm: number;
  readonly areaLossPercent: number;
};

export const calculateTrimLossEdgeRecorder = (
  input: TrimLossEdgeRecorderInput,
): TrimLossEdgeRecorderOutput => {
  for (const key of [
    "originalSheetWidthMm",
    "originalSheetHeightMm",
    "trimmedPageWidthMm",
    "trimmedPageHeightMm",
  ] as const) {
    if (!(Number.isFinite(input[key]) && input[key] > 0))
      return simpleError(
        key,
        "Sheet and page dimensions must be greater than zero.",
        "invalid_dimension",
      );
  }
  if (
    input.trimmedPageWidthMm > input.originalSheetWidthMm ||
    input.trimmedPageHeightMm > input.originalSheetHeightMm
  )
    return simpleError(
      "trimmedPageWidthMm",
      "The trimmed page cannot exceed the original sheet.",
      "invalid_trim",
    );
  const widthLoss = input.originalSheetWidthMm - input.trimmedPageWidthMm;
  const heightLoss = input.originalSheetHeightMm - input.trimmedPageHeightMm;
  const originalAreaSquareMm =
    input.originalSheetWidthMm * input.originalSheetHeightMm;
  const trimmedAreaSquareMm =
    input.trimmedPageWidthMm * input.trimmedPageHeightMm;
  const directLostAreaSquareMm = originalAreaSquareMm - trimmedAreaSquareMm;
  const lostAreaSquareCm = Number.isFinite(directLostAreaSquareMm)
    ? directLostAreaSquareMm / 100
    : (widthLoss * input.originalSheetHeightMm +
        input.trimmedPageWidthMm * heightLoss) /
      100;
  const areaLossPercent = Number.isFinite(originalAreaSquareMm)
    ? (directLostAreaSquareMm / originalAreaSquareMm) * 100
    : (1 -
        (input.trimmedPageWidthMm / input.originalSheetWidthMm) *
          (input.trimmedPageHeightMm / input.originalSheetHeightMm)) *
      100;
  if (!Number.isFinite(lostAreaSquareCm) || !Number.isFinite(areaLossPercent))
    return simpleError(
      "originalSheetWidthMm",
      "The area calculation exceeds the numeric range.",
      "numeric_overflow",
    );
  return {
    lossWidthMm: widthLoss,
    lossHeightMm: heightLoss,
    lostAreaSquareCm,
    areaLossPercent,
  };
};

export const trimLossEdgeRecorderExample = {
  input: {
    originalSheetHeightMm: 300,
    originalSheetWidthMm: 400,
    trimmedPageHeightMm: 280,
    trimmedPageWidthMm: 380,
  },
  output: {
    lossWidthMm: 20,
    lossHeightMm: 20,
    lostAreaSquareCm: 136,
    areaLossPercent: 11.333333333333332,
  },
} satisfies ToolExample<TrimLossEdgeRecorderInput, TrimLossEdgeRecorderOutput>;

export const trimLossEdgeRecorderTool = createSimpleTool({
  id: "paleography/trim-loss-edge-recorder",
  title: "Trim Loss Edge Recorder",
  description:
    "Record the exact material lost when a parchment sheet was trimmed to its present page size: total width and height reductions plus the lost area in square centimetres and as a percentage.",
  inputs: [
    {
      description: "Original sheet width in millimetres.",
      id: "originalSheetWidthMm",
      kind: "number",
      label: "Original width",
      minimum: 0,
    },
    {
      description: "Original sheet height in millimetres.",
      id: "originalSheetHeightMm",
      kind: "number",
      label: "Original height",
      minimum: 0,
    },
    {
      description: "Trimmed page width in millimetres.",
      id: "trimmedPageWidthMm",
      kind: "number",
      label: "Trimmed width",
      minimum: 0,
    },
    {
      description: "Trimmed page height in millimetres.",
      id: "trimmedPageHeightMm",
      kind: "number",
      label: "Trimmed height",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Millimetres trimmed from the width.",
      id: "lossWidthMm",
      kind: "number",
      label: "Width loss",
    },
    {
      description: "Millimetres trimmed from the height.",
      id: "lossHeightMm",
      kind: "number",
      label: "Height loss",
    },
    {
      description: "Lost area in square centimetres.",
      id: "lostAreaSquareCm",
      kind: "number",
      label: "Lost area",
    },
    {
      description: "Lost share of the sheet in percent.",
      id: "areaLossPercent",
      kind: "number",
      label: "Area loss %",
    },
  ],
  calculate: (input) =>
    calculateTrimLossEdgeRecorder({
      originalSheetWidthMm: input.originalSheetWidthMm as number,
      originalSheetHeightMm: input.originalSheetHeightMm as number,
      trimmedPageWidthMm: input.trimmedPageWidthMm as number,
      trimmedPageHeightMm: input.trimmedPageHeightMm as number,
    }),
});

export const runTrimLossEdgeRecorder = trimLossEdgeRecorderTool.execute;
export default trimLossEdgeRecorderTool;
