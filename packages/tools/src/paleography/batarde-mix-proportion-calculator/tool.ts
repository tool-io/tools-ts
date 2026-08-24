import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatardeMixProportionCalculatorInput = {
  readonly textualisFormCount: number;
  readonly cursivaFormCount: number;
};

export type BatardeMixProportionCalculatorOutput = {
  readonly textualisSharePct: number;
  readonly cursivaSharePct: number;
  readonly mixClassification:
    "textualis_dominant" | "balanced_mix" | "cursiva_dominant";
};

export const calculateBatardeMixProportionCalculator = (
  input: BatardeMixProportionCalculatorInput,
): BatardeMixProportionCalculatorOutput => {
  for (const key of ["textualisFormCount", "cursivaFormCount"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 0))
      return simpleError(
        key,
        "Form counts must be non-negative safe integers.",
        "invalid_count",
      );
  }
  const totalForms = input.textualisFormCount + input.cursivaFormCount;
  if (!(Number.isSafeInteger(totalForms) && totalForms > 0))
    return simpleError(
      "textualisFormCount",
      "Score at least one letter form as textualis or cursiva.",
      "invalid_counts",
    );
  const textualisSharePct = (input.textualisFormCount / totalForms) * 100;
  const cursivaSharePct = 100 - textualisSharePct;
  return {
    cursivaSharePct,
    mixClassification:
      Math.abs(textualisSharePct - cursivaSharePct) <= 20
        ? "balanced_mix"
        : textualisSharePct > cursivaSharePct
          ? "textualis_dominant"
          : "cursiva_dominant",
    textualisSharePct,
  };
};

export const batardeMixProportionCalculatorExample = {
  input: { cursivaFormCount: 3, textualisFormCount: 7 },
  output: {
    cursivaSharePct: 30,
    mixClassification: "textualis_dominant",
    textualisSharePct: 70,
  },
} satisfies ToolExample<
  BatardeMixProportionCalculatorInput,
  BatardeMixProportionCalculatorOutput
>;

export const batardeMixProportionCalculatorTool = createSimpleTool({
  id: "paleography/batarde-mix-proportion-calculator",
  title: "Batarde Mix Proportion Calculator",
  description:
    "Compute the textualis-versus-cursiva proportions of a batardesque hand and classify the mix under the stated heuristic: shares within 20 percentage points of each other are balanced, otherwise the larger share dominates.",
  inputs: [
    {
      description: "Letter forms scored as textualis (upright, broken).",
      id: "textualisFormCount",
      kind: "integer",
      label: "Textualis forms",
      minimum: 0,
    },
    {
      description: "Letter forms scored as cursiva (rapid, looped).",
      id: "cursivaFormCount",
      kind: "integer",
      label: "Cursiva forms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Textualis forms as a percentage of all scored forms.",
      id: "textualisSharePct",
      kind: "number",
      label: "Textualis %",
    },
    {
      description: "Cursiva forms as a percentage of all scored forms.",
      id: "cursivaSharePct",
      kind: "number",
      label: "Cursiva %",
    },
    {
      description: "Stated-heuristic classification of the mix.",
      id: "mixClassification",
      enum: ["textualis_dominant", "balanced_mix", "cursiva_dominant"],
      kind: "string",
      label: "Mix class",
    },
  ],
  calculate: (input) =>
    calculateBatardeMixProportionCalculator({
      cursivaFormCount: input.cursivaFormCount as number,
      textualisFormCount: input.textualisFormCount as number,
    }),
});

export const runBatardeMixProportionCalculator =
  batardeMixProportionCalculatorTool.execute;
export default batardeMixProportionCalculatorTool;
