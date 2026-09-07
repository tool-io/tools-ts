import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAirlineSegmentFeeKeys: readonly string[];
  readonly callerVerifiedAirlineSegmentFeeNotices: readonly string[];
  readonly queryAirlineSegmentFeeKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAirlineSegmentFeeKeys",
    label: "Caller verified airline segment fee keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAirlineSegmentFeeNotices",
    label: "Caller verified airline segment fee notices",
    kind: "stringList",
  },
  {
    id: "queryAirlineSegmentFeeKey",
    label: "Query airline segment fee key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAirlineSegmentFeeKeys,
      input.callerVerifiedAirlineSegmentFeeNotices,
      input.queryAirlineSegmentFeeKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAirlineSegmentFeeKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedAirlineSegmentFeeNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryAirlineSegmentFeeKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/airline-ticket-excise-segment-fee-lookup",
  title: "Airline Ticket Excise Segment Fee Lookup",
  description:
    "Caller exact date/jurisdiction/itinerary independently verified ticket segment excise notice, not current fee database. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedAirlineSegmentFeeKeys:
        value.callerVerifiedAirlineSegmentFeeKeys as readonly string[],
      callerVerifiedAirlineSegmentFeeNotices:
        value.callerVerifiedAirlineSegmentFeeNotices as readonly string[],
      queryAirlineSegmentFeeKey: value.queryAirlineSegmentFeeKey as string,
    }),
});
export const run = tool.execute;
export default tool;
