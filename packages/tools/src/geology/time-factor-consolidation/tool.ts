import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimeFactorConsolidationInput = {
  readonly coefficientOfConsolidationM2PerYear: number;
  readonly elapsedTimeYears: number;
  readonly drainagePathM: number;
};

export type TimeFactorConsolidationOutput = {
  readonly timeFactor: number;
};

export const calculateTimeFactorConsolidation = (
  input: TimeFactorConsolidationInput,
): TimeFactorConsolidationOutput => {
  if (!(input.coefficientOfConsolidationM2PerYear > 0))
    simpleError(
      "coefficientOfConsolidationM2PerYear",
      "Coefficient of consolidation must be greater than zero.",
      "invalid_input",
    );
  if (!(input.elapsedTimeYears > 0))
    simpleError(
      "elapsedTimeYears",
      "Elapsed time must be greater than zero.",
      "invalid_time",
    );
  if (!(input.drainagePathM > 0))
    simpleError(
      "drainagePathM",
      "Drainage path must be greater than zero.",
      "invalid_geometry",
    );
  return {
    timeFactor:
      (input.coefficientOfConsolidationM2PerYear * input.elapsedTimeYears) /
      (input.drainagePathM * input.drainagePathM),
  };
};

export const timeFactorConsolidationExample = {
  input: {
    coefficientOfConsolidationM2PerYear: 1,
    elapsedTimeYears: 5,
    drainagePathM: 5,
  },
  output: { timeFactor: 0.2 },
} satisfies ToolExample<
  TimeFactorConsolidationInput,
  TimeFactorConsolidationOutput
>;

export const timeFactorConsolidationTool = createSimpleTool({
  id: "geology/time-factor-consolidation",
  title: "Time Factor Consolidation Calculator",
  description:
    "Terzaghi time factor Tv = cv * t / Hd^2, where cv is the coefficient of consolidation in m2/year, t the elapsed time since loading in years, and Hd the longest drainage path in m (half the layer thickness for double drainage).",
  inputs: [
    {
      description: "Coefficient of consolidation cv in m2/year.",
      id: "coefficientOfConsolidationM2PerYear",
      kind: "number",
      label: "cv",
      minimum: 0,
    },
    {
      description: "Elapsed time t in years.",
      id: "elapsedTimeYears",
      kind: "number",
      label: "t",
      minimum: 0,
    },
    {
      description: "Longest drainage path Hd in m.",
      id: "drainagePathM",
      kind: "number",
      label: "Hd",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Time factor Tv, dimensionless.",
      id: "timeFactor",
      kind: "number",
      label: "Tv",
    },
  ],
  calculate: (input) =>
    calculateTimeFactorConsolidation(
      input as unknown as TimeFactorConsolidationInput,
    ),
});

export const runTimeFactorConsolidation = timeFactorConsolidationTool.execute;
export default timeFactorConsolidationTool;
