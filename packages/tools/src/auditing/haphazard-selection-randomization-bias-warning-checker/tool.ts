import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HaphazardBiasWarningInput = {
  readonly populationComplete: boolean;
  readonly randomnessEvidence: boolean;
  readonly selectionMethod: "haphazard" | "judgment" | "random" | "systematic";
  readonly selectionReproducible: boolean;
  readonly statisticalInferenceRequired: boolean;
};

export type HaphazardBiasWarningOutput = {
  readonly biasedSelectionRisk: boolean;
  readonly suitableForStatisticalInference: boolean;
  readonly warningCount: number;
  readonly warnings: ReadonlyArray<string>;
};

export const checkHaphazardSelectionBias = (
  input: HaphazardBiasWarningInput,
): HaphazardBiasWarningOutput => {
  for (const field of [
    "populationComplete",
    "randomnessEvidence",
    "selectionReproducible",
    "statisticalInferenceRequired",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (
    !["haphazard", "judgment", "random", "systematic"].includes(
      input.selectionMethod,
    )
  )
    simpleError(
      "selectionMethod",
      "Selection method is invalid.",
      "invalid_selection_method",
    );
  const warnings: string[] = [];
  if (input.selectionMethod === "haphazard")
    warnings.push("haphazard_selection");
  else if (input.selectionMethod === "judgment")
    warnings.push("judgment_selection");
  if (!input.populationComplete) warnings.push("population_incomplete");
  if (!input.selectionReproducible) warnings.push("selection_not_reproducible");
  if (!input.randomnessEvidence) warnings.push("randomness_not_evidenced");
  const probabilityBased =
    input.selectionMethod === "random" ||
    input.selectionMethod === "systematic";
  return {
    biasedSelectionRisk: warnings.length > 0,
    suitableForStatisticalInference:
      !input.statisticalInferenceRequired ||
      (probabilityBased &&
        input.populationComplete &&
        input.selectionReproducible &&
        input.randomnessEvidence),
    warningCount: warnings.length,
    warnings,
  };
};

export const haphazardBiasWarningExample = {
  input: {
    populationComplete: true,
    randomnessEvidence: false,
    selectionMethod: "haphazard",
    selectionReproducible: true,
    statisticalInferenceRequired: true,
  },
  output: {
    biasedSelectionRisk: true,
    suitableForStatisticalInference: false,
    warningCount: 2,
    warnings: ["haphazard_selection", "randomness_not_evidenced"],
  },
} satisfies ToolExample<HaphazardBiasWarningInput, HaphazardBiasWarningOutput>;

export const haphazardBiasWarningTool = createSimpleTool({
  calculate: (input) =>
    checkHaphazardSelectionBias({
      populationComplete: input.populationComplete as boolean,
      randomnessEvidence: input.randomnessEvidence as boolean,
      selectionMethod:
        input.selectionMethod as HaphazardBiasWarningInput["selectionMethod"],
      selectionReproducible: input.selectionReproducible as boolean,
      statisticalInferenceRequired:
        input.statisticalInferenceRequired as boolean,
    }),
  description:
    "List selection-bias warnings and reject statistical suitability when the requested inference lacks supported probability selection.",
  id: "auditing/haphazard-selection-randomization-bias-warning-checker",
  inputs: [
    { id: "populationComplete", kind: "boolean", label: "Population complete" },
    {
      id: "randomnessEvidence",
      kind: "boolean",
      label: "Randomness evidenced",
    },
    {
      enum: ["haphazard", "judgment", "random", "systematic"],
      id: "selectionMethod",
      kind: "string",
      label: "Selection method",
    },
    {
      id: "selectionReproducible",
      kind: "boolean",
      label: "Selection reproducible",
    },
    {
      id: "statisticalInferenceRequired",
      kind: "boolean",
      label: "Statistical inference required",
    },
  ],
  outputs: [
    {
      id: "biasedSelectionRisk",
      kind: "boolean",
      label: "Selection-bias warning present",
    },
    {
      id: "suitableForStatisticalInference",
      kind: "boolean",
      label: "Suitable for statistical inference",
    },
    {
      id: "warningCount",
      kind: "integer",
      label: "Warning count",
      minimum: 0,
    },
    { id: "warnings", kind: "stringList", label: "Warnings" },
  ],
  title: "Haphazard Selection Randomization Bias Warning Checker",
});

export const runHaphazardBiasWarning = haphazardBiasWarningTool.execute;
export default haphazardBiasWarningTool;
