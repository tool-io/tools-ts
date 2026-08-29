import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const siteKappaPathTstarDecompositionExample = {
  input: { kappaMeasuredSeconds: 0.05, pathTstarSeconds: 0.02 },
  output: {
    siteKappaSeconds: 0.05 - 0.02,
    pathSharePercent: (0.02 / 0.05) * 100,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const siteKappaPathTstarDecompositionTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ kappaMeasuredSeconds, pathTstarSeconds }) => {
      if (kappaMeasuredSeconds <= 0)
        simpleError("kappaMeasuredSeconds", "Measured kappa must be positive.");
      if (pathTstarSeconds > kappaMeasuredSeconds)
        simpleError(
          "pathTstarSeconds",
          "Path t* cannot exceed measured kappa.",
        );
      return {
        siteKappaSeconds: kappaMeasuredSeconds - pathTstarSeconds,
        pathSharePercent: (pathTstarSeconds / kappaMeasuredSeconds) * 100,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Split measured kappa into site term and path t*: κ_meas ≈ t* + κ₀.",
  id: "seismology/site-kappa-path-tstar-decomposition",
  inputs: [
    {
      minimum: 0,
      description: "Measured near-surface kappa.",
      id: "kappaMeasuredSeconds",
      kind: "number",
      label: "κ",
      unit: "s",
    },
    {
      minimum: 0,
      description: "Whole-path attenuation operator.",
      id: "pathTstarSeconds",
      kind: "number",
      label: "t*",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Residual site kappa.",
      id: "siteKappaSeconds",
      kind: "number",
      label: "κ₀",
      unit: "s",
    },
    {
      description: "Path share of the measured kappa.",
      id: "pathSharePercent",
      kind: "number",
      label: "t*%",
      unit: "%",
    },
  ],
  title: "Site Kappa Path TStar Decomposition",
});
export const runSiteKappaPathTstarDecomposition =
  siteKappaPathTstarDecompositionTool.execute;
export { siteKappaPathTstarDecompositionExample as example };
export default siteKappaPathTstarDecompositionTool;
