import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type YeastBuddingPatternClassifierInput = {
  readonly pattern: "multilateral" | "bipolar" | "unipolar" | "fission";
};

export type YeastBuddingPatternClassifierOutput = {
  readonly buddingClass: YeastBuddingPatternClassifierInput["pattern"];
};

export const yeastBuddingPatternClassifierExample = {
  input: { pattern: "multilateral" },
  output: { buddingClass: "multilateral" },
} satisfies ToolExample<
  YeastBuddingPatternClassifierInput,
  YeastBuddingPatternClassifierOutput
>;

export const BUDDING_PATTERNS = [
  "multilateral",
  "bipolar",
  "unipolar",
  "fission",
] as const;

export const yeastBuddingPatternClassifierTool = createSimpleTool({
  id: "mycology/yeast-budding-pattern-classifier",
  title: "Budding Pattern",
  description:
    "Validate and record a yeast microscopy observation as multilateral, bipolar, unipolar, or fission; the result records morphology and does not identify a species by itself.",
  inputs: [
    {
      enum: [...BUDDING_PATTERNS],
      id: "pattern",
      kind: "string",
      label: "Budding pattern",
    },
  ],
  outputs: [
    {
      enum: [...BUDDING_PATTERNS],
      id: "buddingClass",
      kind: "string",
      label: "Budding class",
    },
  ],
  calculate: (input) => ({
    buddingClass:
      input.pattern as YeastBuddingPatternClassifierInput["pattern"],
  }),
});
export const runYeastBuddingPatternClassifier =
  yeastBuddingPatternClassifierTool.execute;
export default yeastBuddingPatternClassifierTool;
