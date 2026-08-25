import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const LATEX_EXUDATES = [
  "milky-white",
  "watery",
  "colored-changing",
  "absent",
] as const;
type LatexExudate = (typeof LATEX_EXUDATES)[number];

export type LatexExudateDetectorInput = {
  readonly exudate: LatexExudate;
};

export type LatexExudateDetectorOutput = {
  readonly hasLatex: boolean;
  readonly latexDescription: string;
};

export const latexExudateDetectorExample = {
  input: { exudate: "milky-white" },
  output: { hasLatex: true, latexDescription: "milky-white" },
} satisfies ToolExample<LatexExudateDetectorInput, LatexExudateDetectorOutput>;

export const latexExudateDetectorTool = createSimpleTool({
  id: "mycology/latex-exudate-detector",
  title: "Latex Detector",
  description:
    "Detect whether cut flesh exudes latex and record the exudate form.",
  inputs: [
    {
      enum: LATEX_EXUDATES,
      id: "exudate",
      kind: "string",
      label: "Exudate",
    },
  ],
  outputs: [
    { id: "hasLatex", kind: "boolean", label: "Has latex" },
    {
      enum: LATEX_EXUDATES,
      id: "latexDescription",
      kind: "string",
      label: "Latex description",
    },
  ],
  calculate: (input) => {
    const exudate = input.exudate as LatexExudate;
    return { hasLatex: exudate !== "absent", latexDescription: exudate };
  },
});
export const runLatexExudateDetector = latexExudateDetectorTool.execute;
export default latexExudateDetectorTool;
