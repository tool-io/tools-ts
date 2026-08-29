import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rmsTravelTimeResidualQualityExample = {
  input: { residualsSeconds: [0.1, -0.2, 0.15, -0.05] },
  output: { rmsSeconds: 0.13693063937629155, locationQuality: "excellent" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const rmsTravelTimeResidualQualityTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ residualsSeconds }) => {
      const rs = residualsSeconds as number[];
      if (!Array.isArray(rs) || rs.length === 0)
        simpleError("residualsSeconds", "Provide residuals.");
      const rms = Math.sqrt(rs.reduce((a, r) => a + r * r, 0) / rs.length);
      return {
        rmsSeconds: rms,
        locationQuality: rms < 0.2 ? "excellent" : rms < 0.5 ? "good" : "poor",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Root-mean-square travel-time residual and qualitative location quality.",
  id: "seismology/rms-travel-time-residual-quality",
  inputs: [
    {
      description: "Travel-time residuals.",
      id: "residualsSeconds",
      kind: "numberList",
      label: "r_i",
    },
  ],
  outputs: [
    {
      description: "Root-mean-square residual.",
      id: "rmsSeconds",
      kind: "number",
      label: "RMS",
      unit: "s",
    },
    {
      description: "Location quality rating.",
      id: "locationQuality",
      kind: "string",
      label: "Quality",
    },
  ],
  title: "RMS Travel Time Residual Quality Calculator",
});
export const runRmsTravelTimeResidualQuality =
  rmsTravelTimeResidualQualityTool.execute;
export { rmsTravelTimeResidualQualityExample as example };
export default rmsTravelTimeResidualQualityTool;
