import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedOcclusionStageKeys: readonly string[];
  readonly callerVerifiedOcclusionStageNotices: readonly string[];
  readonly queryOcclusionStageKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedOcclusionStageKeys",
    label: "Caller verified occlusion stage keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedOcclusionStageNotices",
    label: "Caller verified occlusion stage notices",
    kind: "stringList",
  },
  {
    id: "queryOcclusionStageKey",
    label: "Query occlusion stage key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedOcclusionStageKeys,
      input.callerVerifiedOcclusionStageNotices,
      input.queryOcclusionStageKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedOcclusionStageKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedOcclusionStageNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryOcclusionStageKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/occlusion-stage-life-cycle-lookup",
  title: "Occlusion Stage Life Cycle Lookup",
  description:
    "Independently verified frontal/occlusion stage reference, not assumed storm life cycle from one timestamp. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedOcclusionStageKeys:
        value.callerVerifiedOcclusionStageKeys as readonly string[],
      callerVerifiedOcclusionStageNotices:
        value.callerVerifiedOcclusionStageNotices as readonly string[],
      queryOcclusionStageKey: value.queryOcclusionStageKey as string,
    }),
});
export const run = tool.execute;
export default tool;
