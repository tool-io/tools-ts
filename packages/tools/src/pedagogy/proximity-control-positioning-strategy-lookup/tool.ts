import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedProximityPlanKeys: readonly string[];
  readonly callerVerifiedProximityPlanNotices: readonly string[];
  readonly queryProximityPlanKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedProximityPlanKeys",
    label: "Caller verified proximity plan keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedProximityPlanNotices",
    label: "Caller verified proximity plan notices",
    kind: "stringList",
  },
  {
    id: "queryProximityPlanKey",
    label: "Query proximity plan key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedProximityPlanKeys,
      input.callerVerifiedProximityPlanNotices,
      input.queryProximityPlanKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedProximityPlanKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedProximityPlanNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryProximityPlanKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/proximity-control-positioning-strategy-lookup",
  title: "Proximity Control Positioning Strategy Lookup",
  description:
    "Query an independently verified classroom proximity, consent and access plan by exact context and edition. Not physical-restraint or intimidation instructions, a live policy source or an efficacy claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedProximityPlanKeys:
        value.callerVerifiedProximityPlanKeys as readonly string[],
      callerVerifiedProximityPlanNotices:
        value.callerVerifiedProximityPlanNotices as readonly string[],
      queryProximityPlanKey: value.queryProximityPlanKey as string,
    }),
});
export const run = tool.execute;
export default tool;
