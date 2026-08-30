import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly badgeCount: number;
  readonly leaderboardEnabled: boolean;
  readonly publicRankings: boolean;
  readonly studentChoiceEnabled: boolean;
  readonly maximumExternalIncentiveFlags: number;
}>;
export type Output = Readonly<{
  readonly externalIncentiveFlags: number;
  readonly intrinsicMotivationRisk: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.badgeCount) ||
    input.badgeCount < 0 ||
    !Number.isSafeInteger(input.maximumExternalIncentiveFlags) ||
    input.maximumExternalIncentiveFlags < 0
  )
    simpleError(
      "badgeCount",
      "Nonnegative badge and policy flag counts required.",
    );
  const externalIncentiveFlags =
    Number(input.badgeCount > 0) +
    Number(input.leaderboardEnabled && input.publicRankings) +
    Number(!input.studentChoiceEnabled);
  return {
    externalIncentiveFlags,
    intrinsicMotivationRisk:
      externalIncentiveFlags > input.maximumExternalIncentiveFlags,
  };
};
export const exampleInput = {
  badgeCount: 3,
  leaderboardEnabled: true,
  publicRankings: true,
  studentChoiceEnabled: false,
  maximumExternalIncentiveFlags: 1,
} satisfies Input;
export const exampleOutput = {
  externalIncentiveFlags: 3,
  intrinsicMotivationRisk: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/gamification-risk-screen",
  title: "Gamification Risk Screen",
  description:
    "Screen gamification design for caller-defined extrinsic-incentive risk flags.",
  inputs: [
    { id: "badgeCount", label: "Badge count", kind: "number" },
    { id: "leaderboardEnabled", label: "Leaderboard enabled", kind: "boolean" },
    { id: "publicRankings", label: "Public rankings", kind: "boolean" },
    {
      id: "studentChoiceEnabled",
      label: "Student choice enabled",
      kind: "boolean",
    },
    {
      id: "maximumExternalIncentiveFlags",
      label: "Maximum external incentive flags",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "externalIncentiveFlags",
      label: "External incentive flags",
      kind: "number",
    },
    {
      id: "intrinsicMotivationRisk",
      label: "Intrinsic motivation risk",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      badgeCount: value.badgeCount as number,
      leaderboardEnabled: value.leaderboardEnabled as boolean,
      publicRankings: value.publicRankings as boolean,
      studentChoiceEnabled: value.studentChoiceEnabled as boolean,
      maximumExternalIncentiveFlags:
        value.maximumExternalIncentiveFlags as number,
    }),
});
export const run = tool.execute;
export default tool;
