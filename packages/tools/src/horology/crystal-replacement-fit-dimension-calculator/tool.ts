import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalFitInput = {
  readonly availableCrystalDepthMillimeters: number;
  readonly caseOpeningDiameterMillimeters: number;
  readonly crystalDiameterMillimeters: number;
  readonly crystalThicknessMillimeters: number;
  readonly maximumThicknessMillimeters: number;
};

export type CrystalFitOutput = {
  readonly depthClearanceMillimeters: number;
  readonly diameterShoulderClearanceMillimeters: number;
  readonly fitsCallerDimensions: boolean;
};

export const screenCrystalReplacementFit = (
  input: CrystalFitInput,
): CrystalFitOutput => {
  if (
    !Number.isFinite(input.caseOpeningDiameterMillimeters) ||
    input.caseOpeningDiameterMillimeters <= 0
  )
    simpleError(
      "caseOpeningDiameterMillimeters",
      "Case-opening diameter must be finite and positive.",
      "case_opening_invalid",
    );
  if (
    !Number.isFinite(input.crystalDiameterMillimeters) ||
    input.crystalDiameterMillimeters <= 0
  )
    simpleError(
      "crystalDiameterMillimeters",
      "Crystal diameter must be finite and positive.",
      "crystal_diameter_invalid",
    );
  if (
    !Number.isFinite(input.crystalThicknessMillimeters) ||
    input.crystalThicknessMillimeters <= 0
  )
    simpleError(
      "crystalThicknessMillimeters",
      "Crystal thickness must be finite and positive.",
      "crystal_thickness_invalid",
    );
  if (
    !Number.isFinite(input.availableCrystalDepthMillimeters) ||
    input.availableCrystalDepthMillimeters <= 0
  )
    simpleError(
      "availableCrystalDepthMillimeters",
      "Available depth must be finite and positive.",
      "available_depth_invalid",
    );
  if (
    !Number.isFinite(input.maximumThicknessMillimeters) ||
    input.maximumThicknessMillimeters <= 0
  )
    simpleError(
      "maximumThicknessMillimeters",
      "Maximum thickness must be finite and positive.",
      "maximum_thickness_invalid",
    );
  const diameterShoulderClearanceMillimeters =
    input.caseOpeningDiameterMillimeters - input.crystalDiameterMillimeters;
  const depthClearanceMillimeters =
    input.availableCrystalDepthMillimeters - input.crystalThicknessMillimeters;
  return {
    depthClearanceMillimeters,
    diameterShoulderClearanceMillimeters,
    fitsCallerDimensions:
      diameterShoulderClearanceMillimeters >= 0 &&
      depthClearanceMillimeters >= 0 &&
      input.crystalThicknessMillimeters <= input.maximumThicknessMillimeters,
  };
};

export const crystalFitExample = {
  input: {
    availableCrystalDepthMillimeters: 2,
    caseOpeningDiameterMillimeters: 30,
    crystalDiameterMillimeters: 29.8,
    crystalThicknessMillimeters: 1.5,
    maximumThicknessMillimeters: 1.8,
  },
  output: {
    depthClearanceMillimeters: 0.5,
    diameterShoulderClearanceMillimeters: 0.1999999999999993,
    fitsCallerDimensions: true,
  },
} satisfies ToolExample<CrystalFitInput, CrystalFitOutput>;

export const crystalFitTool = createSimpleTool({
  calculate: (input) =>
    screenCrystalReplacementFit({
      availableCrystalDepthMillimeters:
        input.availableCrystalDepthMillimeters as number,
      caseOpeningDiameterMillimeters:
        input.caseOpeningDiameterMillimeters as number,
      crystalDiameterMillimeters: input.crystalDiameterMillimeters as number,
      crystalThicknessMillimeters: input.crystalThicknessMillimeters as number,
      maximumThicknessMillimeters: input.maximumThicknessMillimeters as number,
    }),
  description:
    "Screen replacement-crystal diameter and thickness against caller-supplied case-opening, seat-depth, and maximum-thickness dimensions.",
  id: "horology/crystal-replacement-fit-dimension-calculator",
  inputs: [
    {
      id: "availableCrystalDepthMillimeters",
      kind: "number",
      label: "Available crystal-seat depth",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "caseOpeningDiameterMillimeters",
      kind: "number",
      label: "Case-opening diameter",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "crystalDiameterMillimeters",
      kind: "number",
      label: "Replacement crystal diameter",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "crystalThicknessMillimeters",
      kind: "number",
      label: "Replacement crystal thickness",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "maximumThicknessMillimeters",
      kind: "number",
      label: "Caller-specified maximum thickness",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "depthClearanceMillimeters",
      kind: "number",
      label: "Depth clearance",
      unit: "mm",
    },
    {
      id: "diameterShoulderClearanceMillimeters",
      kind: "number",
      label: "Diameter shoulder clearance",
      unit: "mm",
    },
    {
      id: "fitsCallerDimensions",
      kind: "boolean",
      label: "Fits caller dimensions",
    },
  ],
  title: "Crystal Replacement Fit Dimension Calculator",
});

export const runCrystalFit = crystalFitTool.execute;
export default crystalFitTool;
