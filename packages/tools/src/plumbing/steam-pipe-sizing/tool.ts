import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerSteamPipeIds: readonly string[];
  readonly callerVerifiedMatchedSteamMassCapacityKgHour: readonly number[];
  readonly callerVerifiedMatchedSteamVelocityMSecond: readonly number[];
  readonly observedRequiredSteamKgHour: number;
  readonly callerMaximumSteamVelocityMSecond: number;
}>;
export type Output = Readonly<{
  readonly callerJointlyCompatibleSteamPipeIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerSteamPipeIds",
    label: "Caller steam pipe ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMatchedSteamMassCapacityKgHour",
    label: "Caller verified matched steam mass capacity kg hour",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMatchedSteamVelocityMSecond",
    label: "Caller verified matched steam velocity m second",
    kind: "numberList",
  },
  {
    id: "observedRequiredSteamKgHour",
    label: "Observed required steam kg hour",
    kind: "number",
  },
  {
    id: "callerMaximumSteamVelocityMSecond",
    label: "Caller maximum steam velocity m second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMatchedSteamMassCapacityKgHour.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedSteamMassCapacityKgHour"),
  );
  input.callerVerifiedMatchedSteamVelocityMSecond.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedSteamVelocityMSecond"),
  );
  nonnegative(input.observedRequiredSteamKgHour, "observedRequiredSteamKgHour");
  nonnegative(
    input.callerMaximumSteamVelocityMSecond,
    "callerMaximumSteamVelocityMSecond",
  );
  aligned(
    input.callerSteamPipeIds,
    input.callerVerifiedMatchedSteamMassCapacityKgHour,
    "callerSteamPipeIds",
  );
  aligned(
    input.callerSteamPipeIds,
    input.callerVerifiedMatchedSteamVelocityMSecond,
    "callerSteamPipeIds",
  );
  unique(input.callerSteamPipeIds, "pipes");
  return {
    callerJointlyCompatibleSteamPipeIds: input.callerSteamPipeIds.filter(
      (_, i) =>
        input.callerVerifiedMatchedSteamMassCapacityKgHour[i] >=
          input.observedRequiredSteamKgHour &&
        input.callerVerifiedMatchedSteamVelocityMSecond[i] <=
          input.callerMaximumSteamVelocityMSecond,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSteamPipeIds: ["a", "b"],
  callerVerifiedMatchedSteamMassCapacityKgHour: [100, 200],
  callerVerifiedMatchedSteamVelocityMSecond: [20, 40],
  observedRequiredSteamKgHour: 150,
  callerMaximumSteamVelocityMSecond: 30,
} satisfies Input;
export const exampleOutput = {
  callerJointlyCompatibleSteamPipeIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/steam-pipe-sizing",
  title: "Plumbing Steam Pipe Sizing Calculator",
  description:
    "Screen actual steam mass-flow and matched velocity catalog jointly; saturation/superheat/pressure conditions supplied externally, not water or air pipe sizing, no steam operating instructions.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerJointlyCompatibleSteamPipeIds",
      label: "Caller jointly compatible steam pipe ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSteamPipeIds: value.callerSteamPipeIds as readonly string[],
      callerVerifiedMatchedSteamMassCapacityKgHour:
        value.callerVerifiedMatchedSteamMassCapacityKgHour as readonly number[],
      callerVerifiedMatchedSteamVelocityMSecond:
        value.callerVerifiedMatchedSteamVelocityMSecond as readonly number[],
      observedRequiredSteamKgHour: value.observedRequiredSteamKgHour as number,
      callerMaximumSteamVelocityMSecond:
        value.callerMaximumSteamVelocityMSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
