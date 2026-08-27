import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoefficientOfConsolidationInput = {
  readonly timeFactor: number;
  readonly drainagePathM: number;
  readonly elapsedTimeYears: number;
};

export type CoefficientOfConsolidationOutput = {
  readonly coefficientOfConsolidationM2PerYear: number;
};

export const calculateCoefficientOfConsolidation = (
  input: CoefficientOfConsolidationInput,
): CoefficientOfConsolidationOutput => {
  if (!(input.timeFactor > 0))
    simpleError(
      "timeFactor",
      "Time factor must be greater than zero.",
      "invalid_time_factor",
    );
  if (!(input.drainagePathM > 0))
    simpleError(
      "drainagePathM",
      "Drainage path must be greater than zero.",
      "invalid_geometry",
    );
  if (!(input.elapsedTimeYears > 0))
    simpleError(
      "elapsedTimeYears",
      "Elapsed time must be greater than zero.",
      "invalid_time",
    );
  return {
    coefficientOfConsolidationM2PerYear:
      (input.timeFactor * input.drainagePathM * input.drainagePathM) /
      input.elapsedTimeYears,
  };
};

export const coefficientOfConsolidationExample = {
  input: { timeFactor: 0.4, drainagePathM: 2, elapsedTimeYears: 2 },
  output: { coefficientOfConsolidationM2PerYear: 0.8 },
} satisfies ToolExample<
  CoefficientOfConsolidationInput,
  CoefficientOfConsolidationOutput
>;

export const coefficientOfConsolidationTool = createSimpleTool({
  id: "geology/coefficient-of-consolidation",
  title: "Coefficient Of Consolidation Calculator",
  description:
    "Coefficient of consolidation cv = Tv * Hd^2 / t rearranged from the Terzaghi time factor, with Tv dimensionless, drainage path Hd in m and time t in years; result in m2/year.",
  inputs: [
    {
      description: "Time factor Tv, dimensionless.",
      id: "timeFactor",
      kind: "number",
      label: "Tv",
      minimum: 0,
    },
    {
      description: "Longest drainage path Hd in m.",
      id: "drainagePathM",
      kind: "number",
      label: "Hd",
      minimum: 0,
    },
    {
      description: "Elapsed time t in years.",
      id: "elapsedTimeYears",
      kind: "number",
      label: "t",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Coefficient of consolidation cv in m2/year.",
      id: "coefficientOfConsolidationM2PerYear",
      kind: "number",
      label: "cv",
    },
  ],
  calculate: (input) =>
    calculateCoefficientOfConsolidation(
      input as unknown as CoefficientOfConsolidationInput,
    ),
});

export const runCoefficientOfConsolidation =
  coefficientOfConsolidationTool.execute;
export default coefficientOfConsolidationTool;
