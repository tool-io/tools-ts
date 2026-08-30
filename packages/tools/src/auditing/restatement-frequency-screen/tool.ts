import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly restatementCount: number;
  readonly observationYears: number;
  readonly warningRatePerYear: number;
}>;
export type Output = Readonly<{
  readonly restatementsPerYear: number;
  readonly meetsWarningThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.observationYears <= 0)
    simpleError(
      "observationYears",
      "Observation period must be positive.",
      "invalid_period",
    );
  const restatementsPerYear = input.restatementCount / input.observationYears;
  return {
    restatementsPerYear,
    meetsWarningThreshold: restatementsPerYear >= input.warningRatePerYear,
  };
};

export const exampleInput = {
  restatementCount: 3,
  observationYears: 5,
  warningRatePerYear: 0.5,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  restatementCount: 0,
  observationYears: 5,
  warningRatePerYear: 0.5,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      restatementCount: input.restatementCount as number,
      observationYears: input.observationYears as number,
      warningRatePerYear: input.warningRatePerYear as number,
    }),
  description:
    "Calculate restatement frequency and compare it with a caller-defined warning rate.",
  id: "auditing/restatement-frequency-screen",
  inputs: [
    {
      id: "restatementCount",
      label: "Restatement count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "observationYears",
      label: "Observation period",
      kind: "number",
      minimum: 0,
      unit: "years",
    },
    {
      id: "warningRatePerYear",
      label: "Warning rate",
      kind: "number",
      minimum: 0,
      unit: "restatements/year",
    },
  ],
  outputs: [
    {
      id: "restatementsPerYear",
      label: "Restatements per year",
      kind: "number",
      minimum: 0,
      unit: "restatements/year",
    },
    {
      id: "meetsWarningThreshold",
      label: "Meets warning threshold",
      kind: "boolean",
    },
  ],
  title: "Restatement Frequency Screen",
});

export const run = tool.execute;
export default tool;
