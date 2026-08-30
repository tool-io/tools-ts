import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly invitesPerActiveUser: number;
  readonly inviteAcceptanceFraction: number;
  readonly sustainableThreshold: number;
}>;
export type Output = Readonly<{
  readonly viralCoefficient: number;
  readonly atOrAboveThreshold: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.invitesPerActiveUser < 0 ||
    input.inviteAcceptanceFraction < 0 ||
    input.inviteAcceptanceFraction > 1 ||
    input.sustainableThreshold < 0
  )
    simpleError(
      "inviteAcceptanceFraction",
      "Nonnegative invites, acceptance fraction within [0,1], and threshold required.",
    );
  const viralCoefficient =
    input.invitesPerActiveUser * input.inviteAcceptanceFraction;
  return {
    viralCoefficient,
    atOrAboveThreshold: viralCoefficient >= input.sustainableThreshold,
  };
};
export const exampleInput = {
  invitesPerActiveUser: 5,
  inviteAcceptanceFraction: 0.2,
  sustainableThreshold: 1,
} satisfies Input;
export const exampleOutput = {
  viralCoefficient: 1,
  atOrAboveThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/viral-referral-k-factor",
  title: "Viral Referral K Factor",
  description:
    "Estimate referrals generated per active user from invitations and conversion.",
  inputs: [
    {
      id: "invitesPerActiveUser",
      label: "Invites per active user",
      kind: "number",
    },
    {
      id: "inviteAcceptanceFraction",
      label: "Invite acceptance fraction",
      kind: "number",
    },
    {
      id: "sustainableThreshold",
      label: "Sustainable threshold",
      kind: "number",
    },
  ],
  outputs: [
    { id: "viralCoefficient", label: "Viral coefficient", kind: "number" },
    {
      id: "atOrAboveThreshold",
      label: "At or above threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      invitesPerActiveUser: value.invitesPerActiveUser as number,
      inviteAcceptanceFraction: value.inviteAcceptanceFraction as number,
      sustainableThreshold: value.sustainableThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
