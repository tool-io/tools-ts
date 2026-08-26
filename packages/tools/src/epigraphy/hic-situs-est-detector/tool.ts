import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HicSitusEstDetectorInput = {
  readonly text: string;
};

export type HicSitusEstDetectorOutput = {
  readonly present: boolean;
  readonly gender: "masculine" | "feminine" | "unknown";
};

export const calculateHicSitusEstDetector = (
  input: HicSitusEstDetectorInput,
): HicSitusEstDetectorOutput => {
  const m = input.text.match(/\bhic\s+(sita|situs)\s+est\b/i);
  if (!m) return { present: false, gender: "unknown" };
  return {
    present: true,
    gender: m[1]?.toLowerCase() === "sita" ? "feminine" : "masculine",
  };
};

export const hicSitusEstDetectorExample = {
  input: {
    text: "Hic sita est Aurelia",
  },
  output: {
    present: true,
    gender: "feminine",
  },
} satisfies ToolExample<HicSitusEstDetectorInput, HicSitusEstDetectorOutput>;

export const hicSitusEstDetectorTool = createSimpleTool({
  id: "epigraphy/hic-situs-est-detector",
  title: "Hic Situs Est Sepulchral Formula Detector",
  description:
    "Detect the sepulchral burial formula distinguishing masculine situs from feminine sita.",
  inputs: [
    {
      description: "Sepulchral inscription text.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Whether the formula occurs.",
      id: "present",
      kind: "boolean",
      label: "Present",
    },
    {
      description: "Grammatical gender expressed.",
      id: "gender",
      kind: "string",
      label: "Gender",
      enum: ["masculine", "feminine", "unknown"],
    },
  ],
  calculate: (input) =>
    calculateHicSitusEstDetector(input as unknown as HicSitusEstDetectorInput),
});

export const runHicSitusEstDetector = hicSitusEstDetectorTool.execute;
export default hicSitusEstDetectorTool;
