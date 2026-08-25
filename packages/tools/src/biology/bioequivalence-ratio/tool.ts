import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bioequivalenceRatioExample = {
  input: { referenceAuc: 450, testAuc: 472.5 },
  output: { bioequivalencePercent: 105 },
} satisfies ToolExample<
  { readonly referenceAuc: number; readonly testAuc: number },
  { readonly bioequivalencePercent: number }
>;

export const bioequivalenceRatioTool = createSimpleTool({
  id: "biology/bioequivalence-ratio",
  title: "Bioequivalence Ratio",
  description:
    "Express bioequivalence as the test product area under the curve as a percentage of the reference product area under the curve.",
  inputs: [
    {
      description:
        "Area under the plasma concentration-time curve for the test product; must not be negative.",
      id: "testAuc",
      label: "Test AUC",
      kind: "number",
    },
    {
      description:
        "Area under the plasma concentration-time curve for the reference product; must be greater than zero.",
      id: "referenceAuc",
      label: "Reference AUC",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Test-to-reference AUC ratio expressed as a percentage.",
      id: "bioequivalencePercent",
      label: "Bioequivalence",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const testAuc = input.testAuc as number;
    const referenceAuc = input.referenceAuc as number;
    if (!Number.isFinite(testAuc) || testAuc < 0)
      simpleError(
        "testAuc",
        "The test AUC must be a finite non-negative number.",
        "invalid_test_auc",
      );
    if (!Number.isFinite(referenceAuc) || referenceAuc <= 0)
      simpleError(
        "referenceAuc",
        "The reference AUC must be a finite number greater than 0.",
        "invalid_reference_auc",
      );
    const bioequivalencePercent = (testAuc / referenceAuc) * 100;
    if (!Number.isFinite(bioequivalencePercent))
      simpleError(
        "testAuc",
        "Bioequivalence percent overflowed.",
        "numeric_overflow",
      );
    return {
      bioequivalencePercent:
        bioequivalencePercent === 0 ? 0 : bioequivalencePercent,
    };
  },
});
export const runBioequivalenceRatio = bioequivalenceRatioTool.execute;
export default bioequivalenceRatioTool;
