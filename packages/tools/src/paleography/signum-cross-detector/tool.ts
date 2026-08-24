import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SignumCrossDetectorInput = {
  readonly charterText: string;
};

export type SignumCrossDetectorOutput = {
  readonly crossCount: number;
  readonly hasSignumMarks: boolean;
  readonly firstCrossIndex: number;
};

const CROSS_CHARS = [
  "+",
  "\u2020",
  "\u2021",
  "\u271D",
  "\u2720",
  "\u2629",
] as const;

export const calculateSignumCrossDetector = (
  input: SignumCrossDetectorInput,
): SignumCrossDetectorOutput => {
  if (input.charterText.trim().length === 0)
    return simpleError(
      "charterText",
      "Provide the charter text to scan.",
      "invalid_text",
    );
  let crossCount = 0;
  let firstCrossIndex = -1;
  const characters = [...input.charterText];
  characters.forEach((character, index) => {
    if (CROSS_CHARS.some((cross) => cross === character)) {
      crossCount += 1;
      if (firstCrossIndex === -1) firstCrossIndex = index;
    }
  });
  return { crossCount, hasSignumMarks: crossCount > 0, firstCrossIndex };
};

export const signumCrossDetectorExample = {
  input: { charterText: "Signum + Willelmi. Ego \u2021 Radulfus." },
  output: { crossCount: 2, hasSignumMarks: true, firstCrossIndex: 7 },
} satisfies ToolExample<SignumCrossDetectorInput, SignumCrossDetectorOutput>;

export const signumCrossDetectorTool = createSimpleTool({
  id: "paleography/signum-cross-detector",
  title: "Signum Cross Detector",
  description:
    "Scan a charter transcription for signum manus cross marks - plus signs and cross glyphs (+, dagger, double dagger, Latin and Jerusalem crosses) - counting them and locating the first.",
  inputs: [
    {
      description: "Charter transcription to scan.",
      id: "charterText",
      kind: "string",
      label: "Charter text",
    },
  ],
  outputs: [
    {
      description: "Number of cross marks found.",
      id: "crossCount",
      kind: "integer",
      label: "Cross count",
      minimum: 0,
    },
    {
      description: "Whether any cross mark is present.",
      id: "hasSignumMarks",
      kind: "boolean",
      label: "Has signa",
    },
    {
      description: "Character index of the first cross mark (-1 if none).",
      id: "firstCrossIndex",
      kind: "integer",
      label: "First index",
    },
  ],
  calculate: (input) =>
    calculateSignumCrossDetector({ charterText: input.charterText as string }),
});

export const runSignumCrossDetector = signumCrossDetectorTool.execute;
export default signumCrossDetectorTool;
