import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  bounded,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedTeamFieldGoalAttempts: number;
  readonly observedTeamFreeThrowAttempts: number;
  readonly observedTeamOffensiveRebounds: number;
  readonly observedTeamTurnovers: number;
  readonly observedOpponentPossessionEstimate: number;
  readonly observedGameMinutes: number;
  readonly callerRegulationMinutes: number;
  readonly callerFreeThrowWeight: number;
}>;
export type Output = Readonly<{
  readonly observedTeamPossessionEstimate: number;
  readonly modeledRegulationPace: number;
}>;
const inputFields = [
  {
    id: "observedTeamFieldGoalAttempts",
    label: "Observed team field goal attempts",
    kind: "number",
  },
  {
    id: "observedTeamFreeThrowAttempts",
    label: "Observed team free throw attempts",
    kind: "number",
  },
  {
    id: "observedTeamOffensiveRebounds",
    label: "Observed team offensive rebounds",
    kind: "number",
  },
  {
    id: "observedTeamTurnovers",
    label: "Observed team turnovers",
    kind: "number",
  },
  {
    id: "observedOpponentPossessionEstimate",
    label: "Observed opponent possession estimate",
    kind: "number",
  },
  { id: "observedGameMinutes", label: "Observed game minutes", kind: "number" },
  {
    id: "callerRegulationMinutes",
    label: "Caller regulation minutes",
    kind: "number",
  },
  {
    id: "callerFreeThrowWeight",
    label: "Caller free throw weight",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.observedTeamFieldGoalAttempts,
    input.observedTeamFreeThrowAttempts,
    input.observedTeamOffensiveRebounds,
    input.observedTeamTurnovers,
  ].forEach((v) => bounded(v, "count", 0, 1000000));
  nonnegative(input.observedOpponentPossessionEstimate, "opponent");
  positive(input.observedGameMinutes, "minutes");
  positive(input.callerRegulationMinutes, "regulation");
  fraction(input.callerFreeThrowWeight, "weight");
  const estimate =
    input.observedTeamFieldGoalAttempts +
    input.callerFreeThrowWeight * input.observedTeamFreeThrowAttempts -
    input.observedTeamOffensiveRebounds +
    input.observedTeamTurnovers;
  nonnegative(estimate, "possessions");
  return {
    observedTeamPossessionEstimate: estimate,
    modeledRegulationPace:
      (((estimate + input.observedOpponentPossessionEstimate) / 2) *
        input.callerRegulationMinutes) /
      input.observedGameMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTeamFieldGoalAttempts: 80,
  observedTeamFreeThrowAttempts: 20,
  observedTeamOffensiveRebounds: 10,
  observedTeamTurnovers: 15,
  observedOpponentPossessionEstimate: 90,
  observedGameMinutes: 40,
  callerRegulationMinutes: 48,
  callerFreeThrowWeight: 0.44,
} satisfies Input;
export const exampleOutput = {
  observedTeamPossessionEstimate: 93.8,
  modeledRegulationPace: 110.28,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/basketball-pace-possession-estimate",
  title: "Basketball Pace Possession Estimate",
  description:
    "Estimate basketball team possessions from actual FGA/FTA/OREB/TO and average opponent estimate, normalized to caller regulation duration; no exact event possession count or implicit league.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTeamPossessionEstimate",
      label: "Observed team possession estimate",
      kind: "number",
    },
    {
      id: "modeledRegulationPace",
      label: "Modeled regulation pace",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTeamFieldGoalAttempts:
        value.observedTeamFieldGoalAttempts as number,
      observedTeamFreeThrowAttempts:
        value.observedTeamFreeThrowAttempts as number,
      observedTeamOffensiveRebounds:
        value.observedTeamOffensiveRebounds as number,
      observedTeamTurnovers: value.observedTeamTurnovers as number,
      observedOpponentPossessionEstimate:
        value.observedOpponentPossessionEstimate as number,
      observedGameMinutes: value.observedGameMinutes as number,
      callerRegulationMinutes: value.callerRegulationMinutes as number,
      callerFreeThrowWeight: value.callerFreeThrowWeight as number,
    }),
});
export const run = tool.execute;
export default tool;
