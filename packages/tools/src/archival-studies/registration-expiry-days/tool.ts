import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly registrationIssueOrdinals: readonly number[];
  readonly callerRegistrationValidDays: readonly number[];
  readonly asOfDayOrdinal: number;
}>;
export type Output = Readonly<{
  readonly registrationExpiryOrdinals: readonly number[];
  readonly signedRegistrationDaysRemaining: readonly number[];
  readonly expiredBeforeAsOfFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "registrationIssueOrdinals",
    label: "Registration issue ordinals",
    kind: "numberList",
  },
  {
    id: "callerRegistrationValidDays",
    label: "Caller registration valid days",
    kind: "numberList",
  },
  { id: "asOfDayOrdinal", label: "As of day ordinal", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.registrationIssueOrdinals.forEach((v) =>
    count(v, "registrationIssueOrdinals"),
  );
  input.callerRegistrationValidDays.forEach((v) =>
    count(v, "callerRegistrationValidDays"),
  );
  count(input.asOfDayOrdinal, "asOfDayOrdinal");
  aligned(
    input.registrationIssueOrdinals,
    input.callerRegistrationValidDays,
    "registrationIssueOrdinals",
  );
  if (input.registrationIssueOrdinals.some((v) => v > input.asOfDayOrdinal))
    simpleError("issue", "Registration issue cannot be future.");
  const end = input.registrationIssueOrdinals.map((v, i) =>
    count(v + input.callerRegistrationValidDays[i], "expiry"),
  );
  return {
    registrationExpiryOrdinals: end,
    signedRegistrationDaysRemaining: end.map((v) => v - input.asOfDayOrdinal),
    expiredBeforeAsOfFlags: end.map((v) => (v < input.asOfDayOrdinal ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  registrationIssueOrdinals: [10, 20],
  callerRegistrationValidDays: [10, 5],
  asOfDayOrdinal: 25,
} satisfies Input;
export const exampleOutput = {
  registrationExpiryOrdinals: [20, 25],
  signedRegistrationDaysRemaining: [-5, 0],
  expiredBeforeAsOfFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/registration-expiry-days",
  title: "Researcher Registration Expiry Days Remaining Calculator",
  description:
    "Audit caller registration lifetime on continuous day ordinals with expiry-day inclusive convention; not authentication, eligibility or an invented repository registration policy.",
  inputs: inputFields,
  outputs: [
    {
      id: "registrationExpiryOrdinals",
      label: "Registration expiry ordinals",
      kind: "numberList",
    },
    {
      id: "signedRegistrationDaysRemaining",
      label: "Signed registration days remaining",
      kind: "numberList",
    },
    {
      id: "expiredBeforeAsOfFlags",
      label: "Expired before as of flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      registrationIssueOrdinals:
        value.registrationIssueOrdinals as readonly number[],
      callerRegistrationValidDays:
        value.callerRegistrationValidDays as readonly number[],
      asOfDayOrdinal: value.asOfDayOrdinal as number,
    }),
});
export const run = tool.execute;
export default tool;
