import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  utcStamp,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedRequestUtc: string;
  readonly plannedPublicationUtc: string;
  readonly callerApplicableMinimumResponseSeconds: number;
}>;
export type Output = Readonly<{
  readonly observedReplyOpportunitySeconds: number;
  readonly signedCallerWindowReserveSeconds: number;
}>;
const inputFields = [
  { id: "observedRequestUtc", label: "Observed request utc", kind: "string" },
  {
    id: "plannedPublicationUtc",
    label: "Planned publication utc",
    kind: "string",
  },
  {
    id: "callerApplicableMinimumResponseSeconds",
    label: "Caller applicable minimum response seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerApplicableMinimumResponseSeconds,
    "callerApplicableMinimumResponseSeconds",
  );
  const d =
    (utcStamp(input.plannedPublicationUtc) -
      utcStamp(input.observedRequestUtc)) /
    1000;
  nonnegative(d, "requestbeforepublication");
  return {
    observedReplyOpportunitySeconds: d,
    signedCallerWindowReserveSeconds:
      d - input.callerApplicableMinimumResponseSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRequestUtc: "2026-01-01T10:00:00Z",
  plannedPublicationUtc: "2026-01-01T12:00:00Z",
  callerApplicableMinimumResponseSeconds: 3600,
} satisfies Input;
export const exampleOutput = {
  observedReplyOpportunitySeconds: 7200,
  signedCallerWindowReserveSeconds: 3600,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/right-of-reply-comment-request-window-lookup",
  title: "Right of Reply Comment Request Window Lookup",
  description:
    "Actual right-of-reply opportunity against caller independently applicable editorial minimum; no universal legal wait time or evidence recipient received/responded. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedReplyOpportunitySeconds",
      label: "Observed reply opportunity seconds",
      kind: "number",
    },
    {
      id: "signedCallerWindowReserveSeconds",
      label: "Signed caller window reserve seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRequestUtc: value.observedRequestUtc as string,
      plannedPublicationUtc: value.plannedPublicationUtc as string,
      callerApplicableMinimumResponseSeconds:
        value.callerApplicableMinimumResponseSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
