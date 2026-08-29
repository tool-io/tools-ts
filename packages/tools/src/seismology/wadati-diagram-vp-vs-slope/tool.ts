import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const wadatiDiagramVpVsSlopeExample = {
  input: { slopeK: 0.73 },
  output: {
    vpVsRatio: 1.73,
    poissonRatio: (1.73 ** 2 - 2) / (2 * (1.73 ** 2 - 1)),
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const wadatiDiagramVpVsSlopeTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ slopeK }) => {
      if (slopeK <= 0) simpleError("slopeK", "Slope must be positive.");
      const vpVsRatio = 1 + slopeK;
      if (vpVsRatio <= Math.SQRT2)
        simpleError(
          "slopeK",
          "The implied Vp/Vs ratio must exceed √2 for a nonnegative isotropic Poisson ratio.",
        );
      const r2 = vpVsRatio ** 2;
      return { vpVsRatio, poissonRatio: (r2 - 2) / (2 * (r2 - 1)) };
    })(input as never) as Record<string, unknown>,
  description:
    "Recover Vp/Vs from the Wadati diagram slope k (t_s−t_p = k·t_p): Vp/Vs = k + 1.",
  id: "seismology/wadati-diagram-vp-vs-slope",
  inputs: [
    {
      minimum: 0,
      description: "Wadati diagram slope.",
      id: "slopeK",
      kind: "number",
      label: "k",
    },
  ],
  outputs: [
    {
      description: "Recovered velocity ratio.",
      id: "vpVsRatio",
      kind: "number",
      label: "Vp/Vs",
    },
    {
      description: "Implied Poisson ratio.",
      id: "poissonRatio",
      kind: "number",
      label: "ν",
    },
  ],
  title: "Wadati Diagram VP VS Slope Calculator",
});
export const runWadatiDiagramVpVsSlope = wadatiDiagramVpVsSlopeTool.execute;
export { wadatiDiagramVpVsSlopeExample as example };
export default wadatiDiagramVpVsSlopeTool;
