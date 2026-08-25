import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FermaidDoseHlInput = {
  readonly nitrogenContributionMgPerLPerGramPerHl: number;
  readonly yanGapMgPerL: number;
};

export type FermaidDoseHlOutput = {
  readonly fermaidGramsPerHectoliter: number;
};

export const fermaidDoseHlExample = {
  input: {
    nitrogenContributionMgPerLPerGramPerHl: 10,
    yanGapMgPerL: 50,
  },
  output: {
    fermaidGramsPerHectoliter: 5,
  },
} satisfies ToolExample<FermaidDoseHlInput, FermaidDoseHlOutput>;

export const calculateFermaidDoseHl = (
  input: FermaidDoseHlInput,
): FermaidDoseHlOutput => {
  const factor = input.nitrogenContributionMgPerLPerGramPerHl;
  if (factor <= 0)
    simpleError(
      "nitrogenContributionMgPerLPerGramPerHl",
      "The nitrogen contribution per gram must be positive.",
      "invalid_value",
    );
  return {
    fermaidGramsPerHectoliter: roundStatistic(input.yanGapMgPerL / factor),
  };
};

export const fermaidDoseHlTool = createSimpleTool({
  calculate: (input) =>
    calculateFermaidDoseHl(input as unknown as FermaidDoseHlInput),
  description:
    "Convert a yeast-assimilable-nitrogen gap into nutrient grams per hectoliter using the measured or manufacturer-stated YAN contribution for the exact nutrient product.",
  id: "oenology/fermaid-dose-hl",
  inputs: [
    {
      description:
        "YAN still needed after measuring the must against its requirement.",
      id: "yanGapMgPerL",
      kind: "number",
      label: "YAN gap",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description:
        "YAN increase in mg/L produced by each g/hL of the selected nutrient.",
      id: "nitrogenContributionMgPerLPerGramPerHl",
      kind: "number",
      label: "Nitrogen per gram",
      minimum: 0,
      unit: "(mg/L)/(g/hL)",
    },
  ],
  outputs: [
    {
      description: "Complex nutrient to add per hectoliter.",
      id: "fermaidGramsPerHectoliter",
      kind: "number",
      label: "Nutrient dose",
      unit: "g/hL",
    },
  ],
  title: "Yeast Nutrient Grams per hL Calculator",
});
export const runFermaidDoseHl = fermaidDoseHlTool.execute;
export default fermaidDoseHlTool;
