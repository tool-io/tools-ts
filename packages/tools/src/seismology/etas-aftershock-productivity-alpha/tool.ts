import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const etasAftershockProductivityAlphaExample = {
  input: { mainshockMagnitudeMw: 6, completenessMc: 1.5, alphaExponent: 1 },
  output: {
    relativeProductivity: 31622.776601683792,
    perMagnitudeMultiplier: 10,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const etasAftershockProductivityAlphaTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ mainshockMagnitudeMw, completenessMc, alphaExponent }) => ({
      relativeProductivity: Math.pow(
        10,
        alphaExponent * (mainshockMagnitudeMw - completenessMc),
      ),
      perMagnitudeMultiplier: Math.pow(10, alphaExponent),
    }))(input as never) as Record<string, unknown>,
  description:
    "Relative ETAS-style aftershock productivity 10^[α(M−Mc)]. It omits the fitted productivity constant and Omori time integral, so it is a relative factor rather than an expected event count.",
  id: "seismology/etas-aftershock-productivity-alpha",
  inputs: [
    {
      description: "Mainshock magnitude.",
      id: "mainshockMagnitudeMw",
      kind: "number",
      label: "M",
    },
    {
      default: 1.5,
      description: "Completeness magnitude of the count.",
      id: "completenessMc",
      kind: "number",
      label: "Mc",
    },
    {
      default: 1,
      description: "Productivity exponent.",
      id: "alphaExponent",
      kind: "number",
      label: "α",
    },
  ],
  outputs: [
    {
      description:
        "Dimensionless productivity factor before applying a fitted normalization and time integral.",
      id: "relativeProductivity",
      kind: "number",
      label: "λ₀",
    },
    {
      description: "Productivity multiplier for a one-unit magnitude increase.",
      id: "perMagnitudeMultiplier",
      kind: "number",
      label: "×10^α",
    },
  ],
  title: "ETAS Aftershock Productivity Alpha Calculator",
});
export const runEtasAftershockProductivityAlpha =
  etasAftershockProductivityAlphaTool.execute;
export { etasAftershockProductivityAlphaExample as example };
export default etasAftershockProductivityAlphaTool;
