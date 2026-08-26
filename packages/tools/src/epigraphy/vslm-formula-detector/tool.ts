import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type VslmFormulaDetectorInput = {
  readonly text: string;
};

export type VslmFormulaDetectorOutput = {
  readonly present: boolean;
  readonly variant: "laetus" | "libens" | "lubens" | "abbreviation";
};

export const calculateVslmFormulaDetector = (
  input: VslmFormulaDetectorInput,
): VslmFormulaDetectorOutput => {
  const lower = input.text.toLowerCase();
  const abbreviation = /\bv\.?[\u00B7]?s\.?[\u00B7]?l\.?[\u00B7]?m\b/.test(
    lower,
  );
  const variants = ["laetus", "libens", "lubens"] as const;
  const explicit = variants.find((word) =>
    new RegExp("votum\\s+solvit\\s+" + word + "\\s+merito").test(lower),
  );
  if (!abbreviation && !explicit)
    return { present: false, variant: "abbreviation" };
  const variant: VslmFormulaDetectorOutput["variant"] =
    explicit ?? "abbreviation";
  return { present: true, variant };
};

export const vslmFormulaDetectorExample = {
  input: {
    text: "Iovi Optimo Maximo. V.S.L.M.",
  },
  output: {
    present: true,
    variant: "abbreviation",
  },
} satisfies ToolExample<VslmFormulaDetectorInput, VslmFormulaDetectorOutput>;

export const vslmFormulaDetectorTool = createSimpleTool({
  id: "epigraphy/vslm-formula-detector",
  title: "VSLM Votive Fulfilment Formula Detector",
  description:
    "Detect the votum solvit laetus|libens|lubens merito fulfilment formula and its attested variant.",
  inputs: [
    {
      description: "Votive inscription text.",
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
      description: "Variant found.",
      id: "variant",
      kind: "string",
      label: "Variant",
      enum: ["laetus", "libens", "lubens", "abbreviation"],
    },
  ],
  calculate: (input) =>
    calculateVslmFormulaDetector(input as unknown as VslmFormulaDetectorInput),
});

export const runVslmFormulaDetector = vslmFormulaDetectorTool.execute;
export default vslmFormulaDetectorTool;
