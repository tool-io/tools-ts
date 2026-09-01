import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  unique,
  sumMoney,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly primaryBeneficiaryIds: readonly string[];
  readonly primaryBeneficiaryBasisPoints: readonly number[];
  readonly contingentBeneficiaryIds: readonly string[];
  readonly contingentBeneficiaryBasisPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly primarySplitBasisPointsTotal: number;
  readonly contingentSplitBasisPointsTotal: number;
  readonly eachIndependentTierAllocatesExactlyAll: boolean;
}>;
const inputFields = [
  {
    id: "primaryBeneficiaryIds",
    label: "Primary beneficiary ids",
    kind: "stringList",
  },
  {
    id: "primaryBeneficiaryBasisPoints",
    label: "Primary beneficiary basis points",
    kind: "numberList",
  },
  {
    id: "contingentBeneficiaryIds",
    label: "Contingent beneficiary ids",
    kind: "stringList",
  },
  {
    id: "contingentBeneficiaryBasisPoints",
    label: "Contingent beneficiary basis points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.primaryBeneficiaryIds, "primary");
  unique(input.contingentBeneficiaryIds, "contingent");
  aligned(
    input.primaryBeneficiaryIds,
    input.primaryBeneficiaryBasisPoints,
    "primary",
  );
  aligned(
    input.contingentBeneficiaryIds,
    input.contingentBeneficiaryBasisPoints,
    "contingent",
  );
  [
    ...input.primaryBeneficiaryBasisPoints,
    ...input.contingentBeneficiaryBasisPoints,
  ].forEach((v) => bounded(v, "share", 0, 10000));
  const primary = sumMoney(input.primaryBeneficiaryBasisPoints),
    contingent = sumMoney(input.contingentBeneficiaryBasisPoints);
  return {
    primarySplitBasisPointsTotal: primary,
    contingentSplitBasisPointsTotal: contingent,
    eachIndependentTierAllocatesExactlyAll:
      primary === 10000 && contingent === 10000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  primaryBeneficiaryIds: ["a", "b"],
  primaryBeneficiaryBasisPoints: [6000, 4000],
  contingentBeneficiaryIds: ["c"],
  contingentBeneficiaryBasisPoints: [10000],
} satisfies Input;
export const exampleOutput = {
  primarySplitBasisPointsTotal: 10000,
  contingentSplitBasisPointsTotal: 10000,
  eachIndependentTierAllocatesExactlyAll: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/beneficiary-contingent-split-validator",
  title: "Beneficiary Contingent Split Validator",
  description:
    "Validate caller actual primary/contingent allocation tiers independently, each 10000 bps, not adding alternatives together; no beneficiary validity, per stirpes, survivorship or estate advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "primarySplitBasisPointsTotal",
      label: "Primary split basis points total",
      kind: "number",
    },
    {
      id: "contingentSplitBasisPointsTotal",
      label: "Contingent split basis points total",
      kind: "number",
    },
    {
      id: "eachIndependentTierAllocatesExactlyAll",
      label: "Each independent tier allocates exactly all",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      primaryBeneficiaryIds: value.primaryBeneficiaryIds as readonly string[],
      primaryBeneficiaryBasisPoints:
        value.primaryBeneficiaryBasisPoints as readonly number[],
      contingentBeneficiaryIds:
        value.contingentBeneficiaryIds as readonly string[],
      contingentBeneficiaryBasisPoints:
        value.contingentBeneficiaryBasisPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
