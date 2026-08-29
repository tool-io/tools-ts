import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const nonlinearSoilStrainDegradationLookupExample = {
  input: { shearStrainPercent: 0.05, soilType: "sand" },
  output: {
    modulusReductionRatio: 0.5,
    behaviorRegime: "nonlinear but stable",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const nonlinearSoilStrainDegradationLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ shearStrainPercent, soilType }) => {
      const refStrain =
        { sand: 0.05, clay: 0.08, gravel: 0.03 }[soilType] ?? 0.05;
      const ratio = 1 / (1 + shearStrainPercent / refStrain);
      const behaviorRegime =
        shearStrainPercent < 0.001
          ? "linear elastic"
          : shearStrainPercent < 1
            ? "nonlinear but stable"
            : "approaching failure";
      return { modulusReductionRatio: ratio, behaviorRegime };
    })(input as never) as Record<string, unknown>,
  description:
    "Shear modulus reduction (degradation) factor for soil at a given cyclic shear strain.",
  id: "seismology/nonlinear-soil-strain-degradation-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Cyclic shear strain amplitude.",
      id: "shearStrainPercent",
      kind: "number",
      label: "γ",
      unit: "%",
    },
    {
      description: "Generic soil category.",
      enum: ["sand", "clay", "gravel"],
      id: "soilType",
      kind: "string",
      label: "Soil",
    },
  ],
  outputs: [
    {
      description: "Normalized shear modulus.",
      id: "modulusReductionRatio",
      kind: "number",
      label: "G/G_max",
    },
    {
      description: "Linear / nonlinear / failing regime.",
      id: "behaviorRegime",
      kind: "string",
      label: "Regime",
    },
  ],
  title: "Nonlinear Soil Strain Degradation Lookup",
});
export const runNonlinearSoilStrainDegradationLookup =
  nonlinearSoilStrainDegradationLookupTool.execute;
export { nonlinearSoilStrainDegradationLookupExample as example };
export default nonlinearSoilStrainDegradationLookupTool;
