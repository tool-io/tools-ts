import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerMatchedFranchiseRevenueMinor: number;
  readonly callerFranchiseOperatingCostMinor: number;
  readonly callerFranchiseFeesMinor: number;
  readonly callerOwnedUnitRevenueMinor: number;
  readonly callerOwnedUnitOperatingCostMinor: number;
}>;
export type Output = Readonly<{
  readonly franchiseContributionMinor: number;
  readonly ownedUnitContributionMinor: number;
  readonly signedOwnedAdvantageMinor: number;
}>;
const inputFields = [
  {
    id: "callerMatchedFranchiseRevenueMinor",
    label: "Caller matched franchise revenue minor",
    kind: "number",
  },
  {
    id: "callerFranchiseOperatingCostMinor",
    label: "Caller franchise operating cost minor",
    kind: "number",
  },
  {
    id: "callerFranchiseFeesMinor",
    label: "Caller franchise fees minor",
    kind: "number",
  },
  {
    id: "callerOwnedUnitRevenueMinor",
    label: "Caller owned unit revenue minor",
    kind: "number",
  },
  {
    id: "callerOwnedUnitOperatingCostMinor",
    label: "Caller owned unit operating cost minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.callerMatchedFranchiseRevenueMinor,
    input.callerFranchiseOperatingCostMinor,
    input.callerFranchiseFeesMinor,
    input.callerOwnedUnitRevenueMinor,
    input.callerOwnedUnitOperatingCostMinor,
  ].forEach((v) => money(v, "same period monetary input"));
  const f = signedSum([
      input.callerMatchedFranchiseRevenueMinor,
      -input.callerFranchiseOperatingCostMinor,
      -input.callerFranchiseFeesMinor,
    ]),
    o = signedSum([
      input.callerOwnedUnitRevenueMinor,
      -input.callerOwnedUnitOperatingCostMinor,
    ]);
  return {
    franchiseContributionMinor: f,
    ownedUnitContributionMinor: o,
    signedOwnedAdvantageMinor: signedSum([o, -f]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedFranchiseRevenueMinor: 100,
  callerFranchiseOperatingCostMinor: 60,
  callerFranchiseFeesMinor: 20,
  callerOwnedUnitRevenueMinor: 100,
  callerOwnedUnitOperatingCostMinor: 70,
} satisfies Input;
export const exampleOutput = {
  franchiseContributionMinor: 20,
  ownedUnitContributionMinor: 30,
  signedOwnedAdvantageMinor: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/franchise-vs-owned-unit-economics-compare-lookup",
  title: "Franchise vs Owned Unit Economics Compare Lookup",
  description:
    "Exact matched-period franchise/owned unit contribution including separate fees, not investmentROIor franchise/legal recommendation. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "franchiseContributionMinor",
      label: "Franchise contribution minor",
      kind: "number",
    },
    {
      id: "ownedUnitContributionMinor",
      label: "Owned unit contribution minor",
      kind: "number",
    },
    {
      id: "signedOwnedAdvantageMinor",
      label: "Signed owned advantage minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedFranchiseRevenueMinor:
        value.callerMatchedFranchiseRevenueMinor as number,
      callerFranchiseOperatingCostMinor:
        value.callerFranchiseOperatingCostMinor as number,
      callerFranchiseFeesMinor: value.callerFranchiseFeesMinor as number,
      callerOwnedUnitRevenueMinor: value.callerOwnedUnitRevenueMinor as number,
      callerOwnedUnitOperatingCostMinor:
        value.callerOwnedUnitOperatingCostMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
