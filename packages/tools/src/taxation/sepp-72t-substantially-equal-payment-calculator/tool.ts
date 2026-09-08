import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly accountBalanceMinor: number;
  readonly callerSelectedMethod: string;
  readonly callerIndependentInterestBasisPoints: number;
  readonly callerPaymentYears: number;
  readonly callerIndependentLifeExpectancyNumerator: number;
  readonly callerIndependentLifeExpectancyDenominator: number;
}>;
export type Output = Readonly<{ readonly conditionalSeppPaymentMinor: number }>;
const inputFields = [
  { id: "accountBalanceMinor", label: "Account balance minor", kind: "number" },
  {
    id: "callerSelectedMethod",
    label: "Caller selected method",
    kind: "string",
  },
  {
    id: "callerIndependentInterestBasisPoints",
    label: "Caller independent interest basis points",
    kind: "number",
  },
  { id: "callerPaymentYears", label: "Caller payment years", kind: "number" },
  {
    id: "callerIndependentLifeExpectancyNumerator",
    label: "Caller independent life expectancy numerator",
    kind: "number",
  },
  {
    id: "callerIndependentLifeExpectancyDenominator",
    label: "Caller independent life expectancy denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.accountBalanceMinor, "accountBalanceMinor");
  bounded(input.callerIndependentInterestBasisPoints, "interest", 0, 2000);
  bounded(input.callerPaymentYears, "years", 1, 100);
  bounded(
    input.callerIndependentLifeExpectancyNumerator,
    "life numerator",
    1,
    1000000,
  );
  bounded(
    input.callerIndependentLifeExpectancyDenominator,
    "life denominator",
    1,
    1000000,
  );
  if (input.callerSelectedMethod === "rmd")
    return {
      conditionalSeppPaymentMinor: roundMinor(
        BigInt(input.accountBalanceMinor) *
          BigInt(input.callerIndependentLifeExpectancyDenominator),
        BigInt(input.callerIndependentLifeExpectancyNumerator),
      ),
    };
  if (input.callerSelectedMethod !== "amortization")
    simpleError(
      "method",
      "Explicit rmd/amortization only, not inferred annuitization.",
    );
  const p = 10000n,
    q = p + BigInt(input.callerIndependentInterestBasisPoints),
    n = BigInt(input.callerPaymentYears);
  return {
    conditionalSeppPaymentMinor:
      q === p
        ? roundMinor(BigInt(input.accountBalanceMinor), n)
        : roundMinor(
            BigInt(input.accountBalanceMinor) * (q - p) * q ** n,
            p * (q ** n - p ** n),
          ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  accountBalanceMinor: 1000,
  callerSelectedMethod: "amortization",
  callerIndependentInterestBasisPoints: 0,
  callerPaymentYears: 10,
  callerIndependentLifeExpectancyNumerator: 25,
  callerIndependentLifeExpectancyDenominator: 1,
} satisfies Input;
export const exampleOutput = {
  conditionalSeppPaymentMinor: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/sepp-72t-substantially-equal-payment-calculator",
  title: "SEPP 72T Substantially Equal Payment Calculator",
  description:
    "SEPP conditional RMD or fixed amortization with exact caller annual rate and payment years, independently applicable method/rate caps external; not72Tqualification. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalSeppPaymentMinor",
      label: "Conditional sepp payment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      accountBalanceMinor: value.accountBalanceMinor as number,
      callerSelectedMethod: value.callerSelectedMethod as string,
      callerIndependentInterestBasisPoints:
        value.callerIndependentInterestBasisPoints as number,
      callerPaymentYears: value.callerPaymentYears as number,
      callerIndependentLifeExpectancyNumerator:
        value.callerIndependentLifeExpectancyNumerator as number,
      callerIndependentLifeExpectancyDenominator:
        value.callerIndependentLifeExpectancyDenominator as number,
    }),
});
export const run = tool.execute;
export default tool;
