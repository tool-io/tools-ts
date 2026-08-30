import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CaseRefinishingBudgetInput = {
  readonly currentCaseThicknessMillimeters: number;
  readonly minimumAcceptableThicknessMillimeters: number;
  readonly plannedPolishingPasses: number;
};

export type CaseRefinishingBudgetOutput = {
  readonly budgetPercentOfCurrentThickness: number;
  readonly maximumMaterialRemovalMicrometers: number;
  readonly maximumPlannedRemovalPerPassMicrometers: number;
  readonly removalBudgetMillimeters: number;
  readonly refinishingCaveat: string;
};

export const calculateCaseRefinishingBudget = (
  input: CaseRefinishingBudgetInput,
): CaseRefinishingBudgetOutput => {
  if (
    !Number.isFinite(input.currentCaseThicknessMillimeters) ||
    input.currentCaseThicknessMillimeters <= 0
  )
    simpleError(
      "currentCaseThicknessMillimeters",
      "Current thickness must be finite and positive.",
      "current_thickness_invalid",
    );
  if (
    !Number.isFinite(input.minimumAcceptableThicknessMillimeters) ||
    input.minimumAcceptableThicknessMillimeters <= 0
  )
    simpleError(
      "minimumAcceptableThicknessMillimeters",
      "Minimum thickness must be finite and positive.",
      "minimum_thickness_invalid",
    );
  if (
    input.minimumAcceptableThicknessMillimeters >=
    input.currentCaseThicknessMillimeters
  )
    simpleError(
      "minimumAcceptableThicknessMillimeters",
      "Minimum thickness must be below current thickness to provide a removal budget.",
      "nonpositive_removal_budget",
    );
  if (
    !Number.isSafeInteger(input.plannedPolishingPasses) ||
    input.plannedPolishingPasses < 1
  )
    simpleError(
      "plannedPolishingPasses",
      "Planned polishing passes must be a positive safe integer.",
      "polishing_pass_count_invalid",
    );
  const removalBudgetMillimeters =
    input.currentCaseThicknessMillimeters -
    input.minimumAcceptableThicknessMillimeters;
  const maximumMaterialRemovalMicrometers = removalBudgetMillimeters * 1000;
  return {
    budgetPercentOfCurrentThickness:
      (100 * removalBudgetMillimeters) / input.currentCaseThicknessMillimeters,
    maximumMaterialRemovalMicrometers,
    maximumPlannedRemovalPerPassMicrometers:
      maximumMaterialRemovalMicrometers / input.plannedPolishingPasses,
    removalBudgetMillimeters,
    refinishingCaveat:
      "This is a dimensional allocation, not a prediction; actual material removal depends on the case material, geometry, wheel, compound, and craft.",
  };
};

export const caseRefinishingBudgetExample = {
  input: {
    currentCaseThicknessMillimeters: 10,
    minimumAcceptableThicknessMillimeters: 9.5,
    plannedPolishingPasses: 5,
  },
  output: {
    budgetPercentOfCurrentThickness: 5,
    maximumMaterialRemovalMicrometers: 500,
    maximumPlannedRemovalPerPassMicrometers: 100,
    removalBudgetMillimeters: 0.5,
    refinishingCaveat:
      "This is a dimensional allocation, not a prediction; actual material removal depends on the case material, geometry, wheel, compound, and craft.",
  },
} satisfies ToolExample<
  CaseRefinishingBudgetInput,
  CaseRefinishingBudgetOutput
>;

export const caseRefinishingBudgetTool = createSimpleTool({
  calculate: (input) =>
    calculateCaseRefinishingBudget({
      currentCaseThicknessMillimeters:
        input.currentCaseThicknessMillimeters as number,
      minimumAcceptableThicknessMillimeters:
        input.minimumAcceptableThicknessMillimeters as number,
      plannedPolishingPasses: input.plannedPolishingPasses as number,
    }),
  description:
    "Allocate a caller-defined case-thickness removal budget across polishing passes without claiming a guaranteed microns-removed rate.",
  id: "horology/case-refinishing-removal-budget-calculator",
  inputs: [
    {
      id: "currentCaseThicknessMillimeters",
      kind: "number",
      label: "Current case thickness",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "minimumAcceptableThicknessMillimeters",
      kind: "number",
      label: "Minimum acceptable thickness",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "plannedPolishingPasses",
      kind: "integer",
      label: "Planned polishing passes",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "budgetPercentOfCurrentThickness",
      kind: "number",
      label: "Removal budget as percent of current thickness",
      minimum: 0,
      unit: "%",
    },
    {
      id: "maximumMaterialRemovalMicrometers",
      kind: "number",
      label: "Maximum material-removal budget",
      minimum: 0,
      unit: "um",
    },
    {
      id: "maximumPlannedRemovalPerPassMicrometers",
      kind: "number",
      label: "Maximum budgeted removal per pass",
      minimum: 0,
      unit: "um",
    },
    {
      id: "removalBudgetMillimeters",
      kind: "number",
      label: "Removal budget",
      minimum: 0,
      unit: "mm",
    },
    { id: "refinishingCaveat", kind: "string", label: "Refinishing caveat" },
  ],
  title: "Case Refinishing Removal Budget Calculator",
});

export const runCaseRefinishingBudget = caseRefinishingBudgetTool.execute;
export default caseRefinishingBudgetTool;
