import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const jointHypocentralGridSearchStepExample = {
  input: { toleranceKm: 0.5 },
  output: { stepKm: 0.25, nodesPerAxis100km: 401 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const jointHypocentralGridSearchStepTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ toleranceKm }) => {
      if (!(toleranceKm > 0))
        simpleError("toleranceKm", "Location tolerance must be positive.");
      const stepKm = toleranceKm / 2;
      return { stepKm, nodesPerAxis100km: Math.floor(100 / stepKm) + 1 };
    })(input as never) as Record<string, unknown>,
  description:
    "Grid search step sized to half the target location tolerance (Nyquist-style sampling of the misfit surface).",
  id: "seismology/joint-hypocentral-grid-search-step",
  inputs: [
    {
      minimum: 0,
      description: "Target location tolerance.",
      id: "toleranceKm",
      kind: "number",
      label: "ε",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Recommended grid step.",
      id: "stepKm",
      kind: "number",
      label: "Δx",
      unit: "km",
    },
    {
      description: "Nodes needed across a 100 km volume per axis.",
      id: "nodesPerAxis100km",
      kind: "number",
      label: "Nodes",
    },
  ],
  title: "Joint Hypocentral Grid Search Step Calculator",
});
export const runJointHypocentralGridSearchStep =
  jointHypocentralGridSearchStepTool.execute;
export { jointHypocentralGridSearchStepExample as example };
export default jointHypocentralGridSearchStepTool;
