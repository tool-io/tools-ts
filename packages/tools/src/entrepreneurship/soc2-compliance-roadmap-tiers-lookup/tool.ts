import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSoc2RoadmapKeys: readonly string[];
  readonly callerVerifiedSoc2RoadmapNotices: readonly string[];
  readonly querySoc2RoadmapKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedSoc2RoadmapKeys",
    label: "Caller verified soc2 roadmap keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSoc2RoadmapNotices",
    label: "Caller verified soc2 roadmap notices",
    kind: "stringList",
  },
  {
    id: "querySoc2RoadmapKey",
    label: "Query soc2 roadmap key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedSoc2RoadmapKeys,
      input.callerVerifiedSoc2RoadmapNotices,
      input.querySoc2RoadmapKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSoc2RoadmapKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedSoc2RoadmapNotices: [
    "independent reference a",
    "independent reference b",
  ],
  querySoc2RoadmapKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/soc2-compliance-roadmap-tiers-lookup",
  title: "SOC2 Compliance Roadmap Tiers Lookup",
  description:
    "Caller independently verified trust-service scope/readiness/audit roadmap notice; roadmap completion notSOC2report/compliance. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedSoc2RoadmapKeys:
        value.callerVerifiedSoc2RoadmapKeys as readonly string[],
      callerVerifiedSoc2RoadmapNotices:
        value.callerVerifiedSoc2RoadmapNotices as readonly string[],
      querySoc2RoadmapKey: value.querySoc2RoadmapKey as string,
    }),
});
export const run = tool.execute;
export default tool;
