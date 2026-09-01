import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, dateDay } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerTemporaryCardStartCivilDate: string;
  readonly callerTemporaryCardEndExclusiveCivilDate: string;
  readonly observedInspectionCivilDate: string;
  readonly observedTemporaryCardAuthenticityEvidence: boolean;
}>;
export type Output = Readonly<{
  readonly withinCallerTemporaryCardDateWindow: boolean;
  readonly callerTemporalAndAuthenticityEvidencePresent: boolean;
}>;
const inputFields = [
  {
    id: "callerTemporaryCardStartCivilDate",
    label: "Caller temporary card start civil date",
    kind: "string",
  },
  {
    id: "callerTemporaryCardEndExclusiveCivilDate",
    label: "Caller temporary card end exclusive civil date",
    kind: "string",
  },
  {
    id: "observedInspectionCivilDate",
    label: "Observed inspection civil date",
    kind: "string",
  },
  {
    id: "observedTemporaryCardAuthenticityEvidence",
    label: "Observed temporary card authenticity evidence",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const start = dateDay(input.callerTemporaryCardStartCivilDate),
    end = dateDay(input.callerTemporaryCardEndExclusiveCivilDate),
    now = dateDay(input.observedInspectionCivilDate);
  if (end <= start)
    simpleError(
      "window",
      "Positive half-open caller temporary card validity window required.",
    );
  const within = now >= start && now < end;
  return {
    withinCallerTemporaryCardDateWindow: within,
    callerTemporalAndAuthenticityEvidencePresent:
      within && input.observedTemporaryCardAuthenticityEvidence,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTemporaryCardStartCivilDate: "2026-01-01",
  callerTemporaryCardEndExclusiveCivilDate: "2026-02-01",
  observedInspectionCivilDate: "2026-01-31",
  observedTemporaryCardAuthenticityEvidence: true,
} satisfies Input;
export const exampleOutput = {
  withinCallerTemporaryCardDateWindow: true,
  callerTemporalAndAuthenticityEvidencePresent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/binding-temporary-card-validity-lookup",
  title: "Binding Temporary Card Validity Lookup",
  description:
    "Audit actual inspection date within caller verified half-open temporary card window and separate authenticity evidence; not proof of policy binding, insurer validity or vehicle legal compliance.",
  inputs: inputFields,
  outputs: [
    {
      id: "withinCallerTemporaryCardDateWindow",
      label: "Within caller temporary card date window",
      kind: "boolean",
    },
    {
      id: "callerTemporalAndAuthenticityEvidencePresent",
      label: "Caller temporal and authenticity evidence present",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTemporaryCardStartCivilDate:
        value.callerTemporaryCardStartCivilDate as string,
      callerTemporaryCardEndExclusiveCivilDate:
        value.callerTemporaryCardEndExclusiveCivilDate as string,
      observedInspectionCivilDate: value.observedInspectionCivilDate as string,
      observedTemporaryCardAuthenticityEvidence:
        value.observedTemporaryCardAuthenticityEvidence as boolean,
    }),
});
export const run = tool.execute;
export default tool;
