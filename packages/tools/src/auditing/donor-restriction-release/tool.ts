import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly openingRestrictedBalance: number;
  readonly newRestrictedDonations: number;
  readonly qualifyingExpenditures: number;
  readonly recordedReleases: number;
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly availableRestrictedFunds: number;
  readonly eligibleRelease: number;
  readonly releaseDifference: number;
  readonly closingRestrictedBalance: number;
  readonly releaseSupported: boolean;
}>;

export const calculate = (input: Input): Output => {
  const availableRestrictedFunds =
      input.openingRestrictedBalance + input.newRestrictedDonations,
    eligibleRelease = Math.min(
      availableRestrictedFunds,
      input.qualifyingExpenditures,
    );
  if (input.recordedReleases > availableRestrictedFunds)
    simpleError(
      "recordedReleases",
      "Recorded releases cannot exceed available restricted funds.",
      "invalid_release",
    );
  const releaseDifference = input.recordedReleases - eligibleRelease;
  return {
    availableRestrictedFunds,
    eligibleRelease,
    releaseDifference,
    closingRestrictedBalance: availableRestrictedFunds - input.recordedReleases,
    releaseSupported: Math.abs(releaseDifference) <= input.tolerance,
  };
};

export const exampleInput = {
  openingRestrictedBalance: 1000,
  newRestrictedDonations: 500,
  qualifyingExpenditures: 400,
  recordedReleases: 400,
  tolerance: 0,
} satisfies Input;
export const exampleOutput = {
  availableRestrictedFunds: 1500,
  eligibleRelease: 400,
  releaseDifference: 0,
  closingRestrictedBalance: 1100,
  releaseSupported: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      openingRestrictedBalance: input.openingRestrictedBalance as number,
      newRestrictedDonations: input.newRestrictedDonations as number,
      qualifyingExpenditures: input.qualifyingExpenditures as number,
      recordedReleases: input.recordedReleases as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Reconcile nonprofit donor-restriction releases with qualifying expenditures.",
  id: "auditing/donor-restriction-release",
  inputs: [
    {
      id: "openingRestrictedBalance",
      label: "Opening restricted balance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "newRestrictedDonations",
      label: "New restricted donations",
      kind: "number",
      minimum: 0,
    },
    {
      id: "qualifyingExpenditures",
      label: "Qualifying expenditures",
      kind: "number",
      minimum: 0,
    },
    {
      id: "recordedReleases",
      label: "Recorded restriction releases",
      kind: "number",
      minimum: 0,
    },
    {
      id: "tolerance",
      label: "Allowed release difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "availableRestrictedFunds",
      label: "Available restricted funds",
      kind: "number",
      minimum: 0,
    },
    {
      id: "eligibleRelease",
      label: "Eligible release",
      kind: "number",
      minimum: 0,
    },
    {
      id: "releaseDifference",
      label: "Recorded minus eligible release",
      kind: "number",
    },
    {
      id: "closingRestrictedBalance",
      label: "Closing restricted balance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "releaseSupported",
      label: "Recorded release is supported",
      kind: "boolean",
    },
  ],
  title: "Donor-Restriction Release",
});

export const run = tool.execute;
export default tool;
