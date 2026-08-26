import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HeirsFormulaVariantCheckerInput = {
  readonly text: string;
};

export type HeirsFormulaVariantCheckerOutput = {
  readonly spelling: "archaic-sibei" | "classical-sibi" | "none";
  readonly hasDebitForm: boolean;
};

export const calculateHeirsFormulaVariantChecker = (
  input: HeirsFormulaVariantCheckerInput,
): HeirsFormulaVariantCheckerOutput => {
  const lower = input.text.toLowerCase();
  const spelling = lower.includes("sibei")
    ? "archaic-sibei"
    : /\bsibi\b/.test(lower)
      ? "classical-sibi"
      : "none";
  const hasDebitForm = /\bdebit[a-z]{0,3}\b/.test(lower);
  return { spelling, hasDebitForm };
};

export const heirsFormulaVariantCheckerExample = {
  input: {
    text: "D(ebitae) sibei debitae sunt",
  },
  output: {
    spelling: "archaic-sibei",
    hasDebitForm: true,
  },
} satisfies ToolExample<
  HeirsFormulaVariantCheckerInput,
  HeirsFormulaVariantCheckerOutput
>;

export const heirsFormulaVariantCheckerTool = createSimpleTool({
  id: "epigraphy/heirs-formula-variant-checker",
  title: "Sibei / Sibi Debitae Formula Variant Checker",
  description:
    "Check which spelling of the sibei/sibi heirs-formula pronoun an inscription uses and whether a debit- form accompanies it.",
  inputs: [
    {
      description: "Inscription text.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Pronoun spelling found.",
      id: "spelling",
      kind: "string",
      label: "Spelling",
      enum: ["archaic-sibei", "classical-sibi", "none"],
    },
    {
      description: "A debit- form accompanies the pronoun.",
      id: "hasDebitForm",
      kind: "boolean",
      label: "Debit form",
    },
  ],
  calculate: (input) =>
    calculateHeirsFormulaVariantChecker(
      input as unknown as HeirsFormulaVariantCheckerInput,
    ),
});

export const runHeirsFormulaVariantChecker =
  heirsFormulaVariantCheckerTool.execute;
export default heirsFormulaVariantCheckerTool;
