import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  money,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly magiMinor: number;
  readonly callerFullContributionBoundaryMinor: number;
  readonly callerNoContributionBoundaryMinor: number;
  readonly callerFullContributionMinor: number;
}>;
export type Output = Readonly<{
  readonly conditionalPhaseoutContributionMinor: number;
  readonly callerIncomeBand: string;
}>;
const inputFields = [
  { id: "magiMinor", label: "Magi minor", kind: "number" },
  {
    id: "callerFullContributionBoundaryMinor",
    label: "Caller full contribution boundary minor",
    kind: "number",
  },
  {
    id: "callerNoContributionBoundaryMinor",
    label: "Caller no contribution boundary minor",
    kind: "number",
  },
  {
    id: "callerFullContributionMinor",
    label: "Caller full contribution minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.magiMinor, "magiMinor");
  money(
    input.callerFullContributionBoundaryMinor,
    "callerFullContributionBoundaryMinor",
  );
  money(
    input.callerNoContributionBoundaryMinor,
    "callerNoContributionBoundaryMinor",
  );
  money(input.callerFullContributionMinor, "callerFullContributionMinor");
  const span = positive(
      input.callerNoContributionBoundaryMinor -
        input.callerFullContributionBoundaryMinor,
      "positive phaseout span",
    ),
    m = input.magiMinor,
    available =
      m <= input.callerFullContributionBoundaryMinor
        ? input.callerFullContributionMinor
        : m >= input.callerNoContributionBoundaryMinor
          ? 0
          : roundMinor(
              BigInt(input.callerFullContributionMinor) *
                BigInt(input.callerNoContributionBoundaryMinor - m),
              BigInt(span),
            );
  return {
    conditionalPhaseoutContributionMinor: available,
    callerIncomeBand:
      m <= input.callerFullContributionBoundaryMinor
        ? "full"
        : m >= input.callerNoContributionBoundaryMinor
          ? "none"
          : "phaseout",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  magiMinor: 150,
  callerFullContributionBoundaryMinor: 100,
  callerNoContributionBoundaryMinor: 200,
  callerFullContributionMinor: 60,
} satisfies Input;
export const exampleOutput = {
  conditionalPhaseoutContributionMinor: 30,
  callerIncomeBand: "phaseout",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/roth-magi-phaseout-eligibility-checker",
  title: "Roth MAGI Phaseout Eligibility Checker",
  description:
    "Conditional RothMAGIlinear-phaseout amount using caller year/status limits; statutory contribution rounding/minimum external, not legal eligibility. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalPhaseoutContributionMinor",
      label: "Conditional phaseout contribution minor",
      kind: "number",
    },
    { id: "callerIncomeBand", label: "Caller income band", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      magiMinor: value.magiMinor as number,
      callerFullContributionBoundaryMinor:
        value.callerFullContributionBoundaryMinor as number,
      callerNoContributionBoundaryMinor:
        value.callerNoContributionBoundaryMinor as number,
      callerFullContributionMinor: value.callerFullContributionMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
