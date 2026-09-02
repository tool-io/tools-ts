import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  catalogIndex,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerCvvResponseCodes: readonly string[];
  readonly callerMismatchFlags: readonly number[];
  readonly callerKnownOutcomeFlags: readonly number[];
  readonly callerDeclineOnMismatchFlags: readonly number[];
  readonly observedCvvResponseCode: string;
  readonly observedAuthorizationDeclined: boolean;
}>;
export type Output = Readonly<{
  readonly callerMappedKnownCvvMismatch: boolean;
  readonly cvvOutcomeUnknown: boolean;
  readonly callerDeclinePolicyTriggered: boolean;
  readonly observedDeclinePolicyDiscrepancy: boolean;
}>;
const inputFields = [
  {
    id: "callerCvvResponseCodes",
    label: "Caller cvv response codes",
    kind: "stringList",
  },
  {
    id: "callerMismatchFlags",
    label: "Caller mismatch flags",
    kind: "numberList",
  },
  {
    id: "callerKnownOutcomeFlags",
    label: "Caller known outcome flags",
    kind: "numberList",
  },
  {
    id: "callerDeclineOnMismatchFlags",
    label: "Caller decline on mismatch flags",
    kind: "numberList",
  },
  {
    id: "observedCvvResponseCode",
    label: "Observed cvv response code",
    kind: "string",
  },
  {
    id: "observedAuthorizationDeclined",
    label: "Observed authorization declined",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerCvvResponseCodes, "codes");
  for (const v of [
    input.callerMismatchFlags,
    input.callerKnownOutcomeFlags,
    input.callerDeclineOnMismatchFlags,
  ]) {
    aligned(input.callerCvvResponseCodes, v, "codes");
    binary(v, "flags");
  }
  const i = catalogIndex(
      input.callerCvvResponseCodes,
      input.observedCvvResponseCode,
    ),
    known = !!input.callerKnownOutcomeFlags[i],
    mismatch = known && !!input.callerMismatchFlags[i],
    trigger = mismatch && !!input.callerDeclineOnMismatchFlags[i];
  return {
    callerMappedKnownCvvMismatch: mismatch,
    cvvOutcomeUnknown: !known,
    callerDeclinePolicyTriggered: trigger,
    observedDeclinePolicyDiscrepancy:
      trigger && !input.observedAuthorizationDeclined,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCvvResponseCodes: ["M", "N", "U"],
  callerMismatchFlags: [0, 1, 0],
  callerKnownOutcomeFlags: [1, 1, 0],
  callerDeclineOnMismatchFlags: [0, 1, 0],
  observedCvvResponseCode: "N",
  observedAuthorizationDeclined: false,
} satisfies Input;
export const exampleOutput = {
  callerMappedKnownCvvMismatch: true,
  cvvOutcomeUnknown: false,
  callerDeclinePolicyTriggered: true,
  observedDeclinePolicyDiscrepancy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/cvv-mismatch-decline-code-lookup",
  title: "CVV Mismatch Decline Code Lookup",
  description:
    "Audit caller CVV response/decline policy mapping against actual authorization result using code only (no CVV), unknown outcome preserved; no automatic fraud diagnosis or bypass advice. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMappedKnownCvvMismatch",
      label: "Caller mapped known cvv mismatch",
      kind: "boolean",
    },
    { id: "cvvOutcomeUnknown", label: "Cvv outcome unknown", kind: "boolean" },
    {
      id: "callerDeclinePolicyTriggered",
      label: "Caller decline policy triggered",
      kind: "boolean",
    },
    {
      id: "observedDeclinePolicyDiscrepancy",
      label: "Observed decline policy discrepancy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCvvResponseCodes: value.callerCvvResponseCodes as readonly string[],
      callerMismatchFlags: value.callerMismatchFlags as readonly number[],
      callerKnownOutcomeFlags:
        value.callerKnownOutcomeFlags as readonly number[],
      callerDeclineOnMismatchFlags:
        value.callerDeclineOnMismatchFlags as readonly number[],
      observedCvvResponseCode: value.observedCvvResponseCode as string,
      observedAuthorizationDeclined:
        value.observedAuthorizationDeclined as boolean,
    }),
});
export const run = tool.execute;
export default tool;
