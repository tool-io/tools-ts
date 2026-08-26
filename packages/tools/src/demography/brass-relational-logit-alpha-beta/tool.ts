import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrassRelationalLogitAlphaBetaInput = {
  readonly alpha?: number;
  readonly beta?: number;
  readonly standardSurvivalToX: readonly number[];
};

export type BrassRelationalLogitAlphaBetaOutput = {
  readonly fittedSurvivalToX: readonly number[];
};

export const calculateBrassRelationalLogitAlphaBeta = (
  input: BrassRelationalLogitAlphaBetaInput,
): BrassRelationalLogitAlphaBetaOutput => {
  const alpha = input.alpha ?? 0;
  const beta = input.beta ?? 1;
  if (!(typeof alpha === "number" && Number.isFinite(alpha)))
    simpleError("alpha", "Alpha must be a finite number.", "invalid_parameter");
  if (!(typeof beta === "number" && Number.isFinite(beta)))
    simpleError("beta", "Beta must be a finite number.", "invalid_parameter");
  if (input.standardSurvivalToX.length === 0)
    simpleError(
      "standardSurvivalToX",
      "Provide at least one standard survival probability.",
      "invalid_list",
    );
  const fittedSurvivalToX = input.standardSurvivalToX.map((survival) => {
    if (!(
      typeof survival === "number" &&
      Number.isFinite(survival) &&
      survival > 0 &&
      survival < 1
    ))
      simpleError(
        "standardSurvivalToX",
        "Standard survival probabilities must lie strictly between zero and one.",
        "invalid_list",
      );
    const logitStandard = 0.5 * Math.log((1 - survival) / survival);
    const logitFitted = alpha + beta * logitStandard;
    return 1 / (1 + Math.exp(2 * logitFitted));
  });
  return { fittedSurvivalToX };
};

export const brassRelationalLogitAlphaBetaExample = {
  input: { alpha: 0.05, beta: 1.1, standardSurvivalToX: [0.9, 0.7, 0.4] },
  output: {
    fittedSurvivalToX: [
      0.9102708933614096, 0.696783494223522, 0.36679023796035987,
    ],
  },
} satisfies ToolExample<
  BrassRelationalLogitAlphaBetaInput,
  BrassRelationalLogitAlphaBetaOutput
>;

export const brassRelationalLogitAlphaBetaTool = createSimpleTool({
  id: "demography/brass-relational-logit-alpha-beta",
  title: "Brass Relational Logit Alpha Beta",
  description:
    "Fit a life table with the Brass relational logit system Y_fit = alpha + beta * Y_standard applied through logit(s) = 0.5 ln((1-s)/s), returning fitted survivorship values for each standard survival probability.",
  inputs: [
    {
      default: 0,
      description: "Level parameter alpha of the relational system.",
      id: "alpha",
      kind: "number",
      label: "Alpha",
    },
    {
      default: 1,
      description: "Slope parameter beta of the relational system.",
      id: "beta",
      kind: "number",
      label: "Beta",
    },
    {
      description:
        "Standard life table survival probabilities l(x), each strictly between zero and one.",
      id: "standardSurvivalToX",
      kind: "numberList",
      label: "Standard l(x)",
    },
  ],
  outputs: [
    {
      description:
        "Fitted survival probabilities l*(x) for each standard value.",
      id: "fittedSurvivalToX",
      kind: "numberList",
      label: "Fitted l(x)",
    },
  ],
  calculate: (input) =>
    calculateBrassRelationalLogitAlphaBeta(
      input as unknown as BrassRelationalLogitAlphaBetaInput,
    ),
});

export const runBrassRelationalLogitAlphaBeta =
  brassRelationalLogitAlphaBetaTool.execute;
export default brassRelationalLogitAlphaBetaTool;
