import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const coulombStressChangeOnReceiverPlaneExample = {
  input: { shearChangeBar: 0.05, normalChangeBar: 0.2 },
  output: {
    coulombChangeBar: 0.13,
    triggeringVerdict: "promotes failure (>0.1 bar)",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const coulombStressChangeOnReceiverPlaneTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ shearChangeBar, normalChangeBar, effectiveFriction }) => {
      const coulombChangeBar =
        shearChangeBar + (effectiveFriction ?? 0.4) * normalChangeBar;
      return {
        coulombChangeBar,
        triggeringVerdict:
          coulombChangeBar >= 0.1
            ? "promotes failure (>0.1 bar)"
            : coulombChangeBar <= -0.1
              ? "suppresses failure (<−0.1 bar)"
              : "indeterminate stress shadow",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Coulomb failure stress change on a receiver plane: ΔCFF = Δτ + μ′·Δσn (tension positive convention).",
  id: "seismology/coulomb-stress-change-on-receiver-plane",
  inputs: [
    {
      description: "Shear stress change in slip direction.",
      id: "shearChangeBar",
      kind: "number",
      label: "Δτ",
      unit: "bar",
    },
    {
      description: "Normal stress change (positive = unclamping).",
      id: "normalChangeBar",
      kind: "number",
      label: "Δσn",
      unit: "bar",
    },
    {
      default: 0.4,
      description: "Effective friction coefficient.",
      id: "effectiveFriction",
      kind: "number",
      label: "μ′",
    },
  ],
  outputs: [
    {
      description: "Positive values encourage failure.",
      id: "coulombChangeBar",
      kind: "number",
      label: "ΔCFF",
      unit: "bar",
    },
    {
      description: "Common threshold interpretation.",
      id: "triggeringVerdict",
      kind: "string",
      label: "Verdict",
    },
  ],
  title: "Coulomb Stress Change On Receiver Plane Calculator",
});
export const runCoulombStressChangeOnReceiverPlane =
  coulombStressChangeOnReceiverPlaneTool.execute;
export { coulombStressChangeOnReceiverPlaneExample as example };
export default coulombStressChangeOnReceiverPlaneTool;
