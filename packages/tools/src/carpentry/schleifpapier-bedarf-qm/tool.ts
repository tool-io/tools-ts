import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SandpaperRequirementInput = {
  readonly areaM2: number;
  readonly coveragePerSheetM2?: number;
  readonly sandingPasses?: number;
};

export type SandpaperRequirementOutput = {
  readonly sheetsRequired: number;
};

export const sandpaperRequirementExample = {
  input: { areaM2: 12, coveragePerSheetM2: 2, sandingPasses: 3 },
  output: { sheetsRequired: 18 },
} satisfies ToolExample<SandpaperRequirementInput, SandpaperRequirementOutput>;

export const sandpaperRequirementTool = createSimpleTool({
  id: "carpentry/schleifpapier-bedarf-qm",
  title: "Sandpaper Sheet Requirement Calculator",
  description:
    "Compute how many sandpaper sheets a job needs from surface area, sanding passes, and per-sheet coverage.",
  inputs: [
    {
      description: "Surface area to sand in square metres.",
      id: "areaM2",
      kind: "number",
      label: "Surface area",
      unit: "m²",
    },
    {
      default: 3,
      description: "Number of sanding passes over the surface.",
      id: "sandingPasses",
      kind: "integer",
      label: "Sanding passes",
      minimum: 1,
    },
    {
      default: 2,
      description:
        "Area one sheet can cover across all passes in square metres.",
      id: "coveragePerSheetM2",
      kind: "number",
      label: "Coverage per sheet",
      unit: "m²",
    },
  ],
  outputs: [
    {
      description: "Sheets to buy, rounded up to whole sheets.",
      format: "count",
      id: "sheetsRequired",
      kind: "integer",
      label: "Sheets required",
    },
  ],
  calculate: (input) => {
    const areaM2 = input.areaM2 as number;
    if (areaM2 <= 0)
      simpleError(
        "areaM2",
        "The surface area must be greater than zero square metres.",
        "invalid_area",
      );
    const coveragePerSheetM2 = input.coveragePerSheetM2 as number;
    if (coveragePerSheetM2 <= 0)
      simpleError(
        "coveragePerSheetM2",
        "The coverage per sheet must be greater than zero square metres.",
        "invalid_coverage",
      );
    const sandingPasses = input.sandingPasses as number;
    return {
      sheetsRequired: Math.ceil((areaM2 * sandingPasses) / coveragePerSheetM2),
    };
  },
});
export const runSandpaperRequirement = sandpaperRequirementTool.execute;
export default sandpaperRequirementTool;
