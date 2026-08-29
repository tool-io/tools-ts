import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const reservoirInducedStressChangeBarExample = {
  input: { reservoirDepthM: 100 },
  output: {
    stressChangeBar: 9.80665,
    poreCouplingNote:
      "Effective Coulomb change depends on diffusivity; values within ~0.1 bar can trigger if critically stressed.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const reservoirInducedStressChangeBarTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ reservoirDepthM, waterDensityKgM3 }) => {
      if (waterDensityKgM3 <= 0)
        simpleError("waterDensityKgM3", "Water density must be positive.");
      return {
        stressChangeBar: (waterDensityKgM3 * 9.80665 * reservoirDepthM) / 1e5,
        poreCouplingNote:
          "Effective Coulomb change depends on diffusivity; values within ~0.1 bar can trigger if critically stressed.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "First-order Coulomb stress perturbation under a reservoir load: Δσ ≈ ρ·g·h.",
  id: "seismology/reservoir-induced-stress-change-bar",
  inputs: [
    {
      minimum: 0,
      description: "Mean water depth.",
      id: "reservoirDepthM",
      kind: "number",
      label: "h",
      unit: "m",
    },
    {
      default: 1000,
      minimum: 0,
      description: "Water density.",
      id: "waterDensityKgM3",
      kind: "number",
      label: "ρ",
      unit: "kg/m³",
    },
  ],
  outputs: [
    {
      description: "Vertical stress change at the base of the reservoir.",
      id: "stressChangeBar",
      kind: "number",
      label: "Δσ",
      unit: "bar",
    },
    {
      description: "Pore-pressure coupling reminder.",
      id: "poreCouplingNote",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Reservoir Induced Stress Change Bar Calculator",
});
export const runReservoirInducedStressChangeBar =
  reservoirInducedStressChangeBarTool.execute;
export { reservoirInducedStressChangeBarExample as example };
export default reservoirInducedStressChangeBarTool;
