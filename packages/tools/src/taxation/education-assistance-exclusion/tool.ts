import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly employerAssistance: number;
  readonly callerExclusionCap: number;
}>;
export type Output = Readonly<{
  readonly excludedAssistance: number;
  readonly taxableAssistance: number;
  readonly unusedCap: number;
}>;

export const calculate = (input: Input): Output => {
  const excludedAssistance = Math.min(
    input.employerAssistance,
    input.callerExclusionCap,
  );
  return {
    excludedAssistance,
    taxableAssistance: input.employerAssistance - excludedAssistance,
    unusedCap: Math.max(0, input.callerExclusionCap - excludedAssistance),
  };
};

export const exampleInput = {
  employerAssistance: 6000,
  callerExclusionCap: 5000,
} satisfies Input;
export const exampleOutput = {
  excludedAssistance: 5000,
  taxableAssistance: 1000,
  unusedCap: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      employerAssistance: input.employerAssistance as number,
      callerExclusionCap: input.callerExclusionCap as number,
    }),
  description:
    "Split employer education assistance using a caller-supplied exclusion cap.",
  id: "taxation/education-assistance-exclusion",
  inputs: [
    {
      id: "employerAssistance",
      label: "Employer education assistance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "callerExclusionCap",
      label: "Caller exclusion cap",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "excludedAssistance",
      label: "Excluded assistance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxableAssistance",
      label: "Taxable assistance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "unusedCap",
      label: "Unused exclusion cap",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Education Assistance Exclusion",
});

export const run = tool.execute;
export default tool;
