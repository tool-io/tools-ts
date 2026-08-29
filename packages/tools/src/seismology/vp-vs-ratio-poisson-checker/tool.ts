import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const vpVsRatioPoissonCheckerExample = {
  input: { vpKmS: 6.5, vsKmS: 3.75 },
  output: {
    ratioVpVs: 1.7333333333333334,
    poissonRatio: 0.2505543237250555,
    valid: true,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const vpVsRatioPoissonCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ vpKmS, vsKmS }) => {
      if (vsKmS <= 0) simpleError("vsKmS", "Vs must be positive.");
      const ratioVpVs = vpKmS / vsKmS;
      if (ratioVpVs <= Math.SQRT2)
        simpleError("vpKmS", "Vp/Vs must exceed √2.");
      const poissonRatio = (ratioVpVs ** 2 - 2) / (2 * (ratioVpVs ** 2 - 1));
      return {
        ratioVpVs,
        poissonRatio,
        valid: poissonRatio >= 0 && poissonRatio < 0.5,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Compute Vp/Vs and the implied Poisson ratio, flagging unphysical values.",
  id: "seismology/vp-vs-ratio-poisson-checker",
  inputs: [
    {
      minimum: 0,
      description: "P-wave velocity.",
      id: "vpKmS",
      kind: "number",
      label: "V_p",
      unit: "km/s",
    },
    {
      minimum: 0,
      description: "S-wave velocity.",
      id: "vsKmS",
      kind: "number",
      label: "V_s",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Velocity ratio.",
      id: "ratioVpVs",
      kind: "number",
      label: "Vp/Vs",
    },
    {
      description: "Implied Poisson ratio.",
      id: "poissonRatio",
      kind: "number",
      label: "ν",
    },
    {
      description: "Whether ν is physical (0 ≤ ν < 0.5).",
      id: "valid",
      kind: "boolean",
      label: "Valid",
    },
  ],
  title: "VP VS Ratio Poisson Checker",
});
export const runVpVsRatioPoissonChecker = vpVsRatioPoissonCheckerTool.execute;
export { vpVsRatioPoissonCheckerExample as example };
export default vpVsRatioPoissonCheckerTool;
