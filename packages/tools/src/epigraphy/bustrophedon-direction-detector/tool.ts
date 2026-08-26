import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BustrophedonDirectionDetectorInput = {
  readonly lineDirections: readonly string[];
};

export type BustrophedonDirectionDetectorOutput = {
  readonly directionChanges: number;
  readonly alternates: boolean;
  readonly isBustrophedon: boolean;
  readonly firstLineDirection: string;
};

const DIRECTION_TOKENS = new Set(["ltr", "rtl"]);

export const calculateBustrophedonDirectionDetector = (
  input: BustrophedonDirectionDetectorInput,
): BustrophedonDirectionDetectorOutput => {
  const lines = input.lineDirections;
  if (!Array.isArray(lines) || lines.length === 0)
    return simpleError(
      "lineDirections",
      "At least one line direction is required.",
      "empty_directions",
    );
  const normalized = lines.map((direction) => {
    const token = String(direction).trim().toLowerCase();
    if (!DIRECTION_TOKENS.has(token))
      return simpleError(
        "lineDirections",
        `Unknown direction token: ${String(direction)}.`,
        "unknown_direction",
      );
    return token;
  });
  let directionChanges = 0;
  for (let index = 1; index < normalized.length; index += 1)
    if (normalized[index] !== normalized[index - 1]) directionChanges += 1;
  const alternates =
    normalized.length >= 2 && directionChanges === normalized.length - 1;
  return {
    directionChanges,
    alternates,
    isBustrophedon: alternates,
    firstLineDirection: normalized[0],
  };
};

export const bustrophedonDirectionDetectorExample = {
  input: { lineDirections: ["ltr", "rtl", "ltr"] },
  output: {
    directionChanges: 2,
    alternates: true,
    isBustrophedon: true,
    firstLineDirection: "ltr",
  },
} satisfies ToolExample<
  BustrophedonDirectionDetectorInput,
  BustrophedonDirectionDetectorOutput
>;

export const bustrophedonDirectionDetectorTool = createSimpleTool({
  id: "epigraphy/bustrophedon-direction-detector",
  title: "Bustrophedon Direction Alternate-Line Detector",
  description:
    "Detects boustrophedon writing by checking whether per-line 'ltr'/'rtl' directions alternate on every line.",
  inputs: [
    {
      id: "lineDirections",
      kind: "stringList",
      label: "Line directions",
      description: "Per-line direction tokens, each 'ltr' or 'rtl'.",
    },
  ],
  outputs: [
    {
      id: "directionChanges",
      kind: "integer",
      label: "Direction changes",
      description: "Number of adjacent line direction changes.",
    },
    {
      id: "alternates",
      kind: "boolean",
      label: "Alternates",
      description: "Whether every adjacent pair of lines differs.",
    },
    {
      id: "isBustrophedon",
      kind: "boolean",
      label: "Bustrophedon",
      description: "Whether the sequence qualifies as boustrophedon.",
    },
    {
      id: "firstLineDirection",
      kind: "string",
      label: "First direction",
      description: "Normalized direction of the first line.",
    },
  ],
  calculate: (input) =>
    calculateBustrophedonDirectionDetector(
      input as unknown as BustrophedonDirectionDetectorInput,
    ),
});

export const runBustrophedonDirectionDetector =
  bustrophedonDirectionDetectorTool.execute;
export default bustrophedonDirectionDetectorTool;
