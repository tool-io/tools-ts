import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly medicalElection: number;
  readonly dependentCareElection: number;
  readonly medicalCap: number;
  readonly dependentCareCap: number;
}>;
export type Output = Readonly<{
  readonly eligibleMedicalElection: number;
  readonly eligibleDependentCareElection: number;
  readonly excessElection: number;
  readonly eligibleTotal: number;
}>;

export const calculate = (input: Input): Output => {
  const eligibleMedicalElection = Math.min(
      input.medicalElection,
      input.medicalCap,
    ),
    eligibleDependentCareElection = Math.min(
      input.dependentCareElection,
      input.dependentCareCap,
    );
  return {
    eligibleMedicalElection,
    eligibleDependentCareElection,
    excessElection:
      input.medicalElection -
      eligibleMedicalElection +
      input.dependentCareElection -
      eligibleDependentCareElection,
    eligibleTotal: eligibleMedicalElection + eligibleDependentCareElection,
  };
};

export const exampleInput = {
  medicalElection: 3000,
  dependentCareElection: 6000,
  medicalCap: 2500,
  dependentCareCap: 5000,
} satisfies Input;
export const exampleOutput = {
  eligibleMedicalElection: 2500,
  eligibleDependentCareElection: 5000,
  excessElection: 1500,
  eligibleTotal: 7500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      medicalElection: input.medicalElection as number,
      dependentCareElection: input.dependentCareElection as number,
      medicalCap: input.medicalCap as number,
      dependentCareCap: input.dependentCareCap as number,
    }),
  description:
    "Apply separate caller-supplied caps to medical and dependent-care FSA elections.",
  id: "insurance/fsa-election-split",
  inputs: [
    {
      id: "medicalElection",
      label: "Medical FSA election",
      kind: "number",
      minimum: 0,
    },
    {
      id: "dependentCareElection",
      label: "Dependent-care FSA election",
      kind: "number",
      minimum: 0,
    },
    { id: "medicalCap", label: "Medical FSA cap", kind: "number", minimum: 0 },
    {
      id: "dependentCareCap",
      label: "Dependent-care FSA cap",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "eligibleMedicalElection",
      label: "Eligible medical election",
      kind: "number",
      minimum: 0,
    },
    {
      id: "eligibleDependentCareElection",
      label: "Eligible dependent-care election",
      kind: "number",
      minimum: 0,
    },
    {
      id: "excessElection",
      label: "Combined election above supplied caps",
      kind: "number",
      minimum: 0,
    },
    {
      id: "eligibleTotal",
      label: "Total eligible election",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "FSA Election Split",
});

export const run = tool.execute;
export default tool;
