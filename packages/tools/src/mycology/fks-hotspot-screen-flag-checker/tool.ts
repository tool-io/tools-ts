import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const fksHotspotScreenCheckerExample = {
  input: { hotspotMutationDetected: true },
  output: {
    echinocandinResistanceMarkerFlag: true,
    hotspotMutationDetected: true,
    interpretation:
      "An FKS hotspot variant was detected; interpret it by species and variant and correlate with antifungal susceptibility testing.",
  },
} satisfies ToolExample<
  { readonly hotspotMutationDetected: boolean },
  {
    readonly echinocandinResistanceMarkerFlag: boolean;
    readonly hotspotMutationDetected: boolean;
    readonly interpretation: string;
  }
>;

export const fksHotspotScreenCheckerTool = createSimpleTool({
  id: "mycology/fks-hotspot-screen-flag-checker",
  title: "FKS Hotspot Screen",
  description:
    "Flag an observed FKS hotspot variant for echinocandin-resistance review without treating the molecular screen as a definitive susceptibility result.",
  inputs: [
    {
      id: "hotspotMutationDetected",
      kind: "boolean",
      label: "Hotspot mutation detected",
    },
  ],
  outputs: [
    {
      id: "hotspotMutationDetected",
      kind: "boolean",
      label: "Hotspot mutation detected",
    },
    {
      id: "echinocandinResistanceMarkerFlag",
      kind: "boolean",
      label: "Echinocandin resistance-marker flag",
    },
    { id: "interpretation", kind: "string", label: "Interpretation" },
  ],
  calculate: (input) => ({
    hotspotMutationDetected: input.hotspotMutationDetected as boolean,
    echinocandinResistanceMarkerFlag: input.hotspotMutationDetected as boolean,
    interpretation: (input.hotspotMutationDetected as boolean)
      ? "An FKS hotspot variant was detected; interpret it by species and variant and correlate with antifungal susceptibility testing."
      : "No FKS hotspot variant was detected by this screen; resistance is not excluded.",
  }),
});
export const runFksHotspotScreenChecker = fksHotspotScreenCheckerTool.execute;
export default fksHotspotScreenCheckerTool;
