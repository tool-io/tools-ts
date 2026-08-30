import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly jointReturnFiled: boolean;
  readonly understatementAttributableToOtherSpouse: boolean;
  readonly separatedOrNotHouseholdMembers: boolean;
  readonly inequitableToHoldLiable: boolean;
}>;
export type Output = Readonly<{
  readonly suggestedPath: string;
  readonly matchedFactorCount: number;
}>;

export const calculate = (input: Input): Output => {
  const matchedFactorCount = [
    input.jointReturnFiled,
    input.understatementAttributableToOtherSpouse,
    input.separatedOrNotHouseholdMembers,
    input.inequitableToHoldLiable,
  ].filter(Boolean).length;
  let suggestedPath:
    | "innocent-spouse"
    | "separation-of-liability"
    | "equitable-relief"
    | "no-match" = "no-match";
  if (input.jointReturnFiled && input.understatementAttributableToOtherSpouse)
    suggestedPath = input.separatedOrNotHouseholdMembers
      ? "separation-of-liability"
      : "innocent-spouse";
  else if (input.jointReturnFiled && input.inequitableToHoldLiable)
    suggestedPath = "equitable-relief";
  return { suggestedPath, matchedFactorCount };
};

export const exampleInput = {
  jointReturnFiled: true,
  understatementAttributableToOtherSpouse: true,
  separatedOrNotHouseholdMembers: true,
  inequitableToHoldLiable: false,
} satisfies Input;
export const exampleOutput = {
  suggestedPath: "separation-of-liability",
  matchedFactorCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      jointReturnFiled: input.jointReturnFiled as boolean,
      understatementAttributableToOtherSpouse:
        input.understatementAttributableToOtherSpouse as boolean,
      separatedOrNotHouseholdMembers:
        input.separatedOrNotHouseholdMembers as boolean,
      inequitableToHoldLiable: input.inequitableToHoldLiable as boolean,
    }),
  description: "Route supplied spouse-relief facts to a candidate review path.",
  id: "taxation/spouse-relief-selector",
  inputs: [
    {
      id: "jointReturnFiled",
      label: "Joint return was filed",
      kind: "boolean",
    },
    {
      id: "understatementAttributableToOtherSpouse",
      label: "Understatement attributable to other spouse",
      kind: "boolean",
    },
    {
      id: "separatedOrNotHouseholdMembers",
      label: "Separated or not household members",
      kind: "boolean",
    },
    {
      id: "inequitableToHoldLiable",
      label: "Inequitable to hold requester liable",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "suggestedPath",
      label: "Suggested relief path",
      kind: "string",
      enum: [
        "innocent-spouse",
        "separation-of-liability",
        "equitable-relief",
        "no-match",
      ],
    },
    {
      id: "matchedFactorCount",
      label: "Matched relief factors",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Spouse Relief Selector",
});

export const run = tool.execute;
export default tool;
