import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly verifiedRecordedOffenses: number;
  readonly matchedObservationDurationSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedRecordedOffenses",
    label: "Verified recorded offenses",
    kind: "number",
  },
  {
    id: "matchedObservationDurationSeconds",
    label: "Matched observation duration seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.verifiedRecordedOffenses, "offenses");
  positive(input.matchedObservationDurationSeconds, "duration");
  return {
    observedMeanSecondsPerRecordedOffense:
      input.matchedObservationDurationSeconds / input.verifiedRecordedOffenses,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedRecordedOffenses: 100,
    matchedObservationDurationSeconds: 10000,
  },
  output: { result: { observedMeanSecondsPerRecordedOffense: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/crime-clock-one-offense-interval-lookup",
  title: "Crime Clock One Offense Interval Lookup",
  description:
    "Aggregate crime-clock average interval under actual recording duration; not regularly timed offenses, personal victim risk or predictive timer.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
