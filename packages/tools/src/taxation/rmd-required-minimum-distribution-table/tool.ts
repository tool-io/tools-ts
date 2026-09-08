import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly priorYearEndBalanceMinor: number;
  readonly callerDivisorScaledInteger: number;
  readonly callerDivisorScale: number;
}>;
export type Output = Readonly<{ readonly conditionalRmdMinor: number }>;
const inputFields = [
  {
    id: "priorYearEndBalanceMinor",
    label: "Prior year end balance minor",
    kind: "number",
  },
  {
    id: "callerDivisorScaledInteger",
    label: "Caller divisor scaled integer",
    kind: "number",
  },
  { id: "callerDivisorScale", label: "Caller divisor scale", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.priorYearEndBalanceMinor, "priorYearEndBalanceMinor");
  bounded(input.callerDivisorScaledInteger, "divisor numerator", 1, 1000000000);
  bounded(input.callerDivisorScale, "divisor scale", 1, 1000000000);
  return {
    conditionalRmdMinor: roundMinor(
      BigInt(input.priorYearEndBalanceMinor) * BigInt(input.callerDivisorScale),
      BigInt(input.callerDivisorScaledInteger),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  priorYearEndBalanceMinor: 1000,
  callerDivisorScaledInteger: 250,
  callerDivisorScale: 10,
} satisfies Input;
export const exampleOutput = { conditionalRmdMinor: 40 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/rmd-required-minimum-distribution-table",
  title: "RMD Required Minimum Distribution Table Calculator",
  description:
    "Balance divided by caller independently applicable exact scaled life-expectancy divisor; no table/age/account exception inferred. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalRmdMinor",
      label: "Conditional rmd minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      priorYearEndBalanceMinor: value.priorYearEndBalanceMinor as number,
      callerDivisorScaledInteger: value.callerDivisorScaledInteger as number,
      callerDivisorScale: value.callerDivisorScale as number,
    }),
});
export const run = tool.execute;
export default tool;
