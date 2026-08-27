import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrontiumIsotopeRatioInput = {
  readonly measured87Sr86Sr: number;
  readonly measured88Sr86Sr?: number;
};

export type StrontiumIsotopeRatioOutput = {
  readonly massBiasBeta: number;
  readonly corrected87Sr86Sr: number;
};

const TRUE_88SR_86SR = 8.375209;

/**
 * Exponential-law internal normalization against the invariant
 * 88Sr/86Sr = 8.375209:
 * beta = ln((88Sr/86Sr)_true / (88Sr/86Sr)_measured) / ln(88/86),
 * corrected 87Sr/86Sr = measured * exp(beta * ln(87/86)).
 */
export const calculateStrontiumIsotopeRatio = (
  input: StrontiumIsotopeRatioInput,
): StrontiumIsotopeRatioOutput => {
  const measured88 = input.measured88Sr86Sr ?? TRUE_88SR_86SR;
  if (!(input.measured87Sr86Sr > 0))
    return simpleError(
      "measured87Sr86Sr",
      "The measured 87Sr/86Sr ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (!(measured88 > 0))
    return simpleError(
      "measured88Sr86Sr",
      "The measured 88Sr/86Sr ratio must be greater than zero.",
      "invalid_ratio",
    );
  const massBiasBeta =
    Math.log(TRUE_88SR_86SR / measured88) / Math.log(88 / 86);
  return {
    massBiasBeta,
    corrected87Sr86Sr:
      input.measured87Sr86Sr * Math.exp(massBiasBeta * Math.log(87 / 86)),
  };
};

export const strontiumIsotopeRatioExample = {
  input: { measured87Sr86Sr: 0.710248, measured88Sr86Sr: 8.375209 },
  output: { massBiasBeta: 0, corrected87Sr86Sr: 0.710248 },
} satisfies ToolExample<
  StrontiumIsotopeRatioInput,
  StrontiumIsotopeRatioOutput
>;

export const strontiumIsotopeRatioTool = createSimpleTool({
  id: "geology/strontium-isotope-ratio",
  title: "Geology Strontium Isotope Ratio Calculator",
  description:
    "Correct a measured 87Sr/86Sr ratio for instrumental mass bias by exponential-law normalization to 88Sr/86Sr = 8.375209.",
  inputs: [
    {
      description: "Measured (uncorrected) 87Sr/86Sr ratio.",
      id: "measured87Sr86Sr",
      kind: "number",
      label: "Measured 87Sr/86Sr",
      minimum: 0,
    },
    {
      default: 8.375209,
      description: "Measured 88Sr/86Sr used to estimate mass bias.",
      id: "measured88Sr86Sr",
      kind: "number",
      label: "Measured 88Sr/86Sr",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Exponential-law mass bias coefficient per amu.",
      id: "massBiasBeta",
      kind: "number",
      label: "Beta",
    },
    {
      description: "Mass-bias-corrected true 87Sr/86Sr ratio.",
      id: "corrected87Sr86Sr",
      kind: "number",
      label: "Corrected 87Sr/86Sr",
    },
  ],
  calculate: (input) =>
    calculateStrontiumIsotopeRatio(
      input as unknown as StrontiumIsotopeRatioInput,
    ),
});

export const runStrontiumIsotopeRatio = strontiumIsotopeRatioTool.execute;
export default strontiumIsotopeRatioTool;
