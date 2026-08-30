import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SamplingSelectionInput = {
  readonly populationComplete: boolean;
  readonly selectionMethod: "haphazard" | "judgment" | "random" | "systematic";
  readonly selectionReproducible: boolean;
  readonly statisticalInferenceRequired: boolean;
};

export type SamplingSelectionOutput = {
  readonly risk: "elevated" | "high" | "low";
  readonly suitableForStatisticalInference: boolean;
};

export const classifySamplingSelection = (
  input: SamplingSelectionInput,
): SamplingSelectionOutput => {
  for (const field of [
    "populationComplete",
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
  const probabilityBased =
    input.selectionMethod === "random" ||
    input.selectionMethod === "systematic";
  const suitableForStatisticalInference =
    probabilityBased && input.populationComplete && input.selectionReproducible;
  return {
    risk: suitableForStatisticalInference
      ? "low"
      : probabilityBased
        ? "elevated"
        : "high",
    suitableForStatisticalInference:
      suitableForStatisticalInference || !input.statisticalInferenceRequired,
  };
};

export const samplingSelectionExample = {
  input: {
    populationComplete: true,
    selectionMethod: "systematic",
    selectionReproducible: true,
    statisticalInferenceRequired: true,
  },
  output: { risk: "low", suitableForStatisticalInference: true },
} satisfies ToolExample<SamplingSelectionInput, SamplingSelectionOutput>;

export const samplingSelectionTool = createSimpleTool({
  calculate: (input) =>
    classifySamplingSelection({
      populationComplete: input.populationComplete as boolean,
      selectionMethod:
        input.selectionMethod as SamplingSelectionInput["selectionMethod"],
      selectionReproducible: input.selectionReproducible as boolean,
      statisticalInferenceRequired:
        input.statisticalInferenceRequired as boolean,
    }),
  description:
    "Classify selection bias risk from the chosen method, population completeness, reproducibility, and whether statistical inference is required.",
  id: "auditing/sampling-statistical-nonstatistical-selection-classifier",
  inputs: [
    {
      id: "populationComplete",
      kind: "boolean",
      label: "Population complete",
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
      enum: ["elevated", "high", "low"],
      id: "risk",
      kind: "string",
      label: "Selection-bias risk",
    },
    {
      id: "suitableForStatisticalInference",
      kind: "boolean",
      label: "Suitable for requested inference",
    },
  ],
  title: "Sampling Statistical Nonstatistical Selection Classifier",
});

export const runSamplingSelection = samplingSelectionTool.execute;
export default samplingSelectionTool;
