import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  money,
  sumMoney,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerQualifiedResearchExpenseMinor: readonly number[];
  readonly observedTotalResearchExpenseMinor: number;
}>;
export type Output = Readonly<{
  readonly qualifiedResearchBasisPoints: number;
}>;
const inputFields = [
  {
    id: "callerQualifiedResearchExpenseMinor",
    label: "Caller qualified research expense minor",
    kind: "numberList",
  },
  {
    id: "observedTotalResearchExpenseMinor",
    label: "Observed total research expense minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerQualifiedResearchExpenseMinor.forEach((v) =>
    money(v, "callerQualifiedResearchExpenseMinor"),
  );
  money(
    input.observedTotalResearchExpenseMinor,
    "observedTotalResearchExpenseMinor",
  );
  positive(input.observedTotalResearchExpenseMinor, "total research");
  const q = sumMoney(input.callerQualifiedResearchExpenseMinor);
  if (q > input.observedTotalResearchExpenseMinor)
    simpleError("expenses", "Qualified≤total actual research.");
  return {
    qualifiedResearchBasisPoints: roundMinor(
      BigInt(q) * 10000n,
      BigInt(input.observedTotalResearchExpenseMinor),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerQualifiedResearchExpenseMinor: [20, 30],
  observedTotalResearchExpenseMinor: 100,
} satisfies Input;
export const exampleOutput = {
  qualifiedResearchBasisPoints: 5000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/r-and-d-credit-qualified-research-percent",
  title: "R&D Credit Qualified Research Percent Calculator",
  description:
    "Independently qualified research share rounded integer basis points, not R&Dcredit amount or qualified classification. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifiedResearchBasisPoints",
      label: "Qualified research basis points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerQualifiedResearchExpenseMinor:
        value.callerQualifiedResearchExpenseMinor as readonly number[],
      observedTotalResearchExpenseMinor:
        value.observedTotalResearchExpenseMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
