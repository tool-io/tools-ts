import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const withinEventSigmaLambdaExample = {
  input: { sigmaLnUnits: 0.6 },
  output: { fractionalSpreadPercent: 82.21188003905088 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const withinEventSigmaLambdaTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ sigmaLnUnits }) => ({
      fractionalSpreadPercent: (Math.exp(sigmaLnUnits) - 1) * 100,
    }))(input as never) as Record<string, unknown>,
  description:
    "Convert within-event sigma to a standard deviation in natural-log units and its fractional spread.",
  id: "seismology/within-event-sigma-lambda",
  inputs: [
    {
      minimum: 0,
      description: "Within-event sigma in ln units.",
      id: "sigmaLnUnits",
      kind: "number",
      label: "σ",
    },
  ],
  outputs: [
    {
      description: "One-sigma fractional spread about the median.",
      id: "fractionalSpreadPercent",
      kind: "number",
      label: "±%",
      unit: "%",
    },
  ],
  title: "Within Event Sigma Lambda Calculator",
});
export const runWithinEventSigmaLambda = withinEventSigmaLambdaTool.execute;
export { withinEventSigmaLambdaExample as example };
export default withinEventSigmaLambdaTool;
