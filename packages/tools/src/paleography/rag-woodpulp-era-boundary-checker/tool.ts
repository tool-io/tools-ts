import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RagWoodpulpEraBoundaryCheckerInput = {
  readonly productionYear: number;
};

export type RagWoodpulpEraBoundaryCheckerOutput = {
  readonly materialEra:
    "rag_only_era" | "wood_pulp_transition" | "wood_pulp_dominant_era";
  readonly woodPulpLikelyInUse: boolean;
};

export const calculateRagWoodpulpEraBoundaryChecker = (
  input: RagWoodpulpEraBoundaryCheckerInput,
): RagWoodpulpEraBoundaryCheckerOutput => {
  if (
    !Number.isSafeInteger(input.productionYear) ||
    input.productionYear < 700 ||
    input.productionYear > 2100
  )
    return simpleError(
      "productionYear",
      "Production year must be an integer from 700 to 2100.",
      "invalid_year",
    );
  const materialEra =
    input.productionYear <= 1843
      ? "rag_only_era"
      : input.productionYear <= 1860
        ? "wood_pulp_transition"
        : "wood_pulp_dominant_era";
  return { materialEra, woodPulpLikelyInUse: input.productionYear >= 1844 };
};

export const ragWoodpulpEraBoundaryCheckerExample = {
  input: { productionYear: 1850 },
  output: { materialEra: "wood_pulp_transition", woodPulpLikelyInUse: true },
} satisfies ToolExample<
  RagWoodpulpEraBoundaryCheckerInput,
  RagWoodpulpEraBoundaryCheckerOutput
>;

export const ragWoodpulpEraBoundaryCheckerTool = createSimpleTool({
  id: "paleography/rag-woodpulp-era-boundary-checker",
  title: "Rag vs Wood-Pulp Era Boundary Checker",
  description:
    "Place a paper's production year against the documented fibre boundary stated plainly: rag-only before Keller's 1844 wood-pulp process, a transition to 1860, and commercially dominant wood pulp from 1861 onward.",
  inputs: [
    {
      description: "Year the sheet was produced.",
      id: "productionYear",
      kind: "integer",
      label: "Production year",
      maximum: 2100,
      minimum: 700,
    },
  ],
  outputs: [
    {
      description: "Fibre era for the given year.",
      id: "materialEra",
      enum: ["rag_only_era", "wood_pulp_transition", "wood_pulp_dominant_era"],
      kind: "string",
      label: "Material era",
    },
    {
      description:
        "True from 1844 onward, when wood-pulp fibre becomes possible.",
      id: "woodPulpLikelyInUse",
      kind: "boolean",
      label: "Wood pulp likely",
    },
  ],
  calculate: (input) =>
    calculateRagWoodpulpEraBoundaryChecker({
      productionYear: input.productionYear as number,
    }),
});

export const runRagWoodpulpEraBoundaryChecker =
  ragWoodpulpEraBoundaryCheckerTool.execute;
export default ragWoodpulpEraBoundaryCheckerTool;
