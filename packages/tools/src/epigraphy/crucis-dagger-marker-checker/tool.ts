import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrucisDaggerMarkerCheckerInput = {
  readonly text: string;
};

export type CrucisDaggerMarkerCheckerOutput = {
  readonly daggerCount: number;
  readonly positions: readonly number[];
  readonly hasCrux: boolean;
};

export const calculateCrucisDaggerMarkerChecker = (
  input: CrucisDaggerMarkerCheckerInput,
): CrucisDaggerMarkerCheckerOutput => {
  if (!input.text.trim())
    return simpleError("text", "Editorial text is required.", "invalid_text");
  const positions: number[] = [];
  for (let i = 0; i < input.text.length; i += 1)
    if (input.text[i] === "\u2020") positions.push(i);
  return {
    daggerCount: positions.length,
    positions,
    hasCrux: positions.length > 0,
  };
};

export const crucisDaggerMarkerCheckerExample = {
  input: { text: "lectio \u2020dubia\u2020" },
  output: { daggerCount: 2, positions: [7, 13], hasCrux: true },
} satisfies ToolExample<
  CrucisDaggerMarkerCheckerInput,
  CrucisDaggerMarkerCheckerOutput
>;

export const crucisDaggerMarkerCheckerTool = createSimpleTool({
  id: "epigraphy/crucis-dagger-marker-checker",
  title: "Editorial Crux Dagger Marker Flag Checker",
  description:
    "Flag crux translationis daggers (U+2020) in an editorial transcription, reporting their count and zero-based character positions.",
  inputs: [
    {
      description: "Editorial transcription text.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Number of dagger characters found.",
      id: "daggerCount",
      kind: "integer",
      label: "Daggers",
    },
    {
      description: "Zero-based positions of each dagger.",
      id: "positions",
      kind: "numberList",
      label: "Positions",
    },
    {
      description: "True when at least one crux marker is present.",
      id: "hasCrux",
      kind: "boolean",
      label: "Has crux",
    },
  ],
  calculate: (input) =>
    calculateCrucisDaggerMarkerChecker(
      input as unknown as CrucisDaggerMarkerCheckerInput,
    ),
});

export const runCrucisDaggerMarkerChecker =
  crucisDaggerMarkerCheckerTool.execute;
export default crucisDaggerMarkerCheckerTool;
