import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentlyEligibleItemCostsMinor: readonly number[];
  readonly callerApplicablePerItemCapMinor: number;
  readonly callerElectionConfirmed: boolean;
}>;
export type Output = Readonly<{
  readonly callerCostScreenIndices: readonly number[];
  readonly aboveCallerCapIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "independentlyEligibleItemCostsMinor",
    label: "Independently eligible item costs minor",
    kind: "numberList",
  },
  {
    id: "callerApplicablePerItemCapMinor",
    label: "Caller applicable per item cap minor",
    kind: "number",
  },
  {
    id: "callerElectionConfirmed",
    label: "Caller election confirmed",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentlyEligibleItemCostsMinor.forEach((v) =>
    money(v, "independentlyEligibleItemCostsMinor"),
  );
  money(
    input.callerApplicablePerItemCapMinor,
    "callerApplicablePerItemCapMinor",
  );
  return {
    callerCostScreenIndices: input.independentlyEligibleItemCostsMinor.flatMap(
      (v, i) =>
        input.callerElectionConfirmed &&
        v <= input.callerApplicablePerItemCapMinor
          ? [i]
          : [],
    ),
    aboveCallerCapIndices: input.independentlyEligibleItemCostsMinor.flatMap(
      (v, i) => (v > input.callerApplicablePerItemCapMinor ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyEligibleItemCostsMinor: [100, 300],
  callerApplicablePerItemCapMinor: 250,
  callerElectionConfirmed: true,
} satisfies Input;
export const exampleOutput = {
  callerCostScreenIndices: [0],
  aboveCallerCapIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/de-minimis-safe-harbor-2500-election-checker",
  title: "De Minimis Safe Harbor 2500 Election Checker",
  description:
    "Per-item de-minimis safe-harbor election/cost screen, explicit applicable cap/invoice-unit basis; title2500not hardcoded, accounting-policy requirements external. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCostScreenIndices",
      label: "Caller cost screen indices",
      kind: "numberList",
    },
    {
      id: "aboveCallerCapIndices",
      label: "Above caller cap indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyEligibleItemCostsMinor:
        value.independentlyEligibleItemCostsMinor as readonly number[],
      callerApplicablePerItemCapMinor:
        value.callerApplicablePerItemCapMinor as number,
      callerElectionConfirmed: value.callerElectionConfirmed as boolean,
    }),
});
export const run = tool.execute;
export default tool;
